import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, finalize, first, forkJoin, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { TreeReportService } from 'src/app/farm/tree-report.service';
import { TreeService } from 'src/app/farm/tree.service';
import { PhotoService } from 'src/app/farm/util/photo.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { TreeIdInheritable } from '../tree-id.inhertible';

@Component({
  selector: 'app-new-report-form',
  templateUrl: './new-report-form.component.html',
  styleUrls: ['./new-report-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReportFormComponent extends TreeIdInheritable implements OnInit {
  buddingOptions = ['未着花', '良好', '不良'];
  yieldOptions = ['未', '良好', '不良'];
  public newReportForm = new FormGroup({
    notes: new FormControl(''),
    height: new FormControl(100, [Validators.required]),
    budding: new FormControl('未着花'),
    beanYield: new FormControl('未'),
    picture: new FormControl<File | null>(null),
    individualFertilization: new FormControl(false),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  public regularId = new Observable<number>();
  @Output() submitted = new EventEmitter<void>();

  constructor(
    private treeService: TreeService,
    private treeReportService: TreeReportService,
    private photoService: PhotoService,
    private logService: LogService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.regularId = this.getFarmIdAreaIdAndTreeId().pipe(
      switchMap(([farmId, areaId, treeId]) => this.treeService.getTree(farmId, areaId, treeId)),
      map((tree) => tree.regularId),
    );
    // Load last recorded height to make input of just pictures easier
    this.getFarmIdAreaIdAndTreeId()
      .pipe(
        mergeMap(([farmId, areaId, treeId]) => this.treeReportService.getLatestReport(farmId, areaId, treeId)),
        first(),
      )
      .subscribe((report) => this.newReportForm.controls.height.setValue(report?.height ?? 100));
  }

  public handleReportSubmit(event: Event) {
    if (this.loadingSubject.value) return;
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) throw Error();
    const formData = new FormData(form);
    this.loadingSubject.next(true);
    const notes = this.newReportForm.controls.notes.value!.trim();
    const height = this.newReportForm.controls.height.value!;
    const budding = this.newReportForm.controls.budding.value!.trim();
    const beanYield = this.newReportForm.controls.beanYield.value!;
    const picture = formData.get('picture')!;
    let photoPath = '';
    if (!(picture instanceof File)) throw TypeError();
    this.getFarmIdAreaIdAndTreeId()
      .pipe(
        switchMap(([farmId, areaId, treeId]) =>
          forkJoin([
            of([farmId, areaId, treeId]),
            picture.size
              ? from(PhotoService.compressPhoto(picture)).pipe(
                  mergeMap((picture) => {
                    photoPath = `pictures/${farmId}/${areaId}/${treeId}/${Date.now() + picture.name}`;
                    return this.photoService.uploadPhoto(picture, photoPath);
                  }),
                )
              : of(''),
          ]),
        ),
        tap({
          next: ([[farmId, _, treeId]]) => {
            this.submitted.emit();
            this.logService.addLog(farmId, LogActions.AddTreeReport, treeId).subscribe();
          },
        }),
        switchMap(([[farmId, areaId, treeId], photoURL]) =>
          this.treeReportService.addReport(farmId, areaId, treeId, {
            notes,
            height,
            budding,
            createdAt: Date.now(),
            beanYield,
            photoURL,
            photoPath,
          }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newReportForm.reset({
            notes: '',
            height: this.newReportForm.controls.height.value,
            budding: '未着花',
            beanYield: '未',
          });
        }),
      )
      .subscribe();
  }
}
