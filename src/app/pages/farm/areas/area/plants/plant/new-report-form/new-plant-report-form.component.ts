import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, finalize, first, forkJoin, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { PhotoService } from 'src/app/farm/util/photo.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { PlantIdInheritable } from '../plant-id.inhertible';
import { Plant, PlantReport, ToFormGroupType } from '@farm/plants/plant.model';
import { PlantFactory } from '@farm/plants/plant.factory';
import { PlantServiceImplementation } from '@farm/plants/plant.service';
import { PlantReportServiceImplementation } from '@farm/plants/plant-report.service';

@Component({
  selector: 'farm-new-plant-report-form',
  templateUrl: './new-plant-report-form.component.html',
  styleUrls: ['./new-plant-report-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPlantReportFormComponent extends PlantIdInheritable implements OnInit {
  protected plantService = inject(PlantServiceImplementation);
  protected plantReportService = inject(PlantReportServiceImplementation);
  private photoService = inject(PhotoService);
  private logService = inject(LogService);
  protected plantFactory = new PlantFactory();
  newReportForm: FormGroup = new FormGroup({
    notes: new FormControl('', { nonNullable: true }),
    height: new FormControl(100, { nonNullable: true, validators: [Validators.required] }),
    picture: new FormControl<File | null>(null),
    individualFertilization: new FormControl(false, { nonNullable: true }),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading = this.loadingSubject.asObservable();
  readonly regularId = this.getFarmIdAreaIdAndPlantId().pipe(
    switchMap(([farmId, areaId, plantId]) => this.plantService.get(farmId, areaId, plantId)),
    map((plant) => plant.regularId),
  );
  @Output() submitted = new EventEmitter<void>();

  ngOnInit(): void {
    // Load last recorded height to make input of just pictures easier
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, plantId]) => this.plantReportService.getLatestReport(farmId, areaId, plantId)),
        first(),
      )
      .subscribe((report) => {
        this.newReportForm.controls['height'].setValue(report?.height ?? 100);
      });
  }

  protected createReportData(): PlantReport {
    const notes = this.newReportForm.controls['notes'].value.trim();
    const height = this.newReportForm.controls['height'].value;
    const individualFertilization = this.newReportForm.controls['individualFertilization'].value;
    return this.plantFactory.createReport({ notes, height, individualFertilization });
  }

  public handleReportSubmit(event: Event) {
    if (this.loadingSubject.value) return;
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) throw Error();
    const formData = new FormData(form);
    this.loadingSubject.next(true);
    const reportData = this.createReportData();
    const picture = formData.get('picture')!;
    let photoPath = '';
    if (!(picture instanceof File)) throw TypeError();
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        switchMap(([farmId, areaId, plantId]) =>
          forkJoin([
            of([farmId, areaId, plantId]),
            picture.size
              ? from(PhotoService.compressPhoto(picture)).pipe(
                  mergeMap((picture) => {
                    photoPath = `pictures/${farmId}/${areaId}/${plantId}/${Date.now() + picture.name}`;
                    return this.photoService.uploadPhoto(picture, photoPath);
                  }),
                )
              : of(''),
          ]),
        ),
        tap({
          next: ([[farmId, _, plantId]]) => {
            this.submitted.emit();
            this.logService.addLog(farmId, LogActions.AddTreeReport, plantId).subscribe();
          },
        }),
        switchMap(([[farmId, areaId, plantId], photoURL]) =>
          this.plantReportService.addReport(farmId, areaId, plantId, { ...reportData, photoURL }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newReportForm.controls['notes'].reset();
          this.newReportForm.controls['individualFertilization'].reset();
        }),
      )
      .subscribe();
  }
}
