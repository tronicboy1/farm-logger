import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize, first, forkJoin, from, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { TreeReportService } from 'src/app/farm/tree-report.service';
import { TreeService } from 'src/app/farm/tree.service';
import { PhotoService } from 'src/app/farm/util/photo.service';

@Component({
  selector: 'app-new-report-form',
  templateUrl: './new-report-form.component.html',
  styleUrls: ['./new-report-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReportFormComponent implements OnInit {
  buddingOptions = ['未着花', '良好', '不良'];
  yieldOptions = ['未', '良好', '不良'];
  public newReportForm = new FormGroup({
    notes: new FormControl(''),
    height: new FormControl(100, [Validators.required]),
    budding: new FormControl('未着花'),
    beanYield: new FormControl('未'),
    picture: new FormControl<File | null>(null),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  public regularId = new Observable<number>();
  @Output() submitted = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private treeService: TreeService,
    private treeReportService: TreeReportService,
    private photoService: PhotoService,
  ) {}

  ngOnInit(): void {
    this.regularId = this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId, treeId]) => this.treeService.getTree(farmId, areaId, treeId)),
      map((tree) => tree.regularId),
    );
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
    if (!(picture instanceof File)) throw TypeError();
    this.getFarmIdAndAreaId()
      .pipe(
        switchMap(([farmId, areaId, treeId]) =>
          forkJoin([
            of([farmId, areaId, treeId]),
            picture.size
              ? from(PhotoService.compressPhoto(picture)).pipe(
                  mergeMap((picture) =>
                    this.photoService.uploadPhoto(
                      picture,
                      `pictures/${farmId}/${areaId}/${treeId}/${Date.now() + picture.name}`,
                    ),
                  ),
                )
              : of(''),
          ]),
        ),
        switchMap(([[farmId, areaId, treeId], photoURL]) =>
          this.treeReportService.addReport(farmId, areaId, treeId, {
            notes,
            height,
            budding,
            createdAt: Date.now(),
            beanYield,
            photoURL,
          }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newReportForm.reset({ notes: '', height: 100, budding: '未着火', beanYield: '未' });
          this.submitted.emit();
        }),
      )
      .subscribe();
  }

  private getFarmIdAndAreaId() {
    const params$ = [
      this.route.parent!.parent!.params.pipe(
        first(),
        map(({ farmId }) => {
          if (typeof farmId !== 'string') throw TypeError('no farmId');
          return farmId;
        }),
      ),
      this.route.parent!.params.pipe(
        first(),
        map(({ areaId }) => {
          if (typeof areaId !== 'string') throw TypeError('no areaId');
          return areaId;
        }),
      ),
      this.route.params.pipe(
        first(),
        map(({ treeId }) => {
          if (typeof treeId !== 'string') throw TypeError('no treeId');
          return treeId;
        }),
      ),
    ] as const;
    return forkJoin(params$);
  }
}
