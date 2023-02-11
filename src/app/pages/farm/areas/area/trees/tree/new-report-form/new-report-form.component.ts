import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BuddingConditions,
  buddingConditionsText,
  YieldConditions,
  yieldConditionsText,
} from '@farm/plants/coffee-tree/tree.model';
import { BehaviorSubject, finalize, first, forkJoin, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { PhotoService } from 'src/app/farm/util/photo.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { TreeIdInheritable } from '../tree-id.inhertible';
import { TreeReportService } from '@farm/plants/coffee-tree/tree-report.service';

type SelectOptions<T> = { value: T; name: string }[];

@Component({
  selector: 'app-new-report-form',
  templateUrl: './new-report-form.component.html',
  styleUrls: ['./new-report-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewReportFormComponent extends TreeIdInheritable implements OnInit {
  buddingOptions: SelectOptions<BuddingConditions> = Array.from(buddingConditionsText.entries()).map(
    ([value, name]) => ({ value, name }),
  );
  yieldOptions: SelectOptions<YieldConditions> = Array.from(yieldConditionsText.entries()).map(([value, name]) => ({
    value,
    name,
  }));
  public newReportForm = new FormGroup({
    notes: new FormControl('', { nonNullable: true }),
    height: new FormControl(100, { nonNullable: true, validators: [Validators.required] }),
    budding: new FormControl<BuddingConditions>(BuddingConditions.NotYet, { nonNullable: true }),
    beanYield: new FormControl<YieldConditions>(YieldConditions.NotYet, { nonNullable: true }),
    picture: new FormControl<File | null>(null),
    individualFertilization: new FormControl(false, { nonNullable: true }),
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
      switchMap(([farmId, areaId, treeId]) => this.treeService.get(farmId, areaId, treeId)),
      map((tree) => tree.regularId),
    );
    // Load last recorded height to make input of just pictures easier
    this.getFarmIdAreaIdAndTreeId()
      .pipe(
        mergeMap(([farmId, areaId, treeId]) => this.treeReportService.getLatestReport(farmId, areaId, treeId)),
        first(),
      )
      .subscribe((report) => {
        this.newReportForm.controls.height.setValue(report?.height ?? 100);
        if (typeof report?.beanYield !== 'number' || typeof report.budding !== 'number') return; // Do not get default values for old data
        this.newReportForm.controls.budding.setValue(report.budding);
        this.newReportForm.controls.beanYield.setValue(report.beanYield);
      });
  }

  public handleReportSubmit(event: Event) {
    if (this.loadingSubject.value) return;
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) throw Error();
    const formData = new FormData(form);
    this.loadingSubject.next(true);
    const notes = this.newReportForm.controls.notes.value.trim();
    const height = this.newReportForm.controls.height.value;
    const budding = this.newReportForm.controls.budding.value;
    const beanYield = this.newReportForm.controls.beanYield.value;
    const individualFertilization = this.newReportForm.controls.individualFertilization.value;
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
            individualFertilization,
          }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newReportForm.reset({
            notes: '',
            height: this.newReportForm.controls.height.value,
            budding: this.newReportForm.controls.budding.value,
            beanYield: this.newReportForm.controls.beanYield.value,
          });
        }),
      )
      .subscribe();
  }
}
