import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlantFactory } from '@farm/plants/plant.factory';
import { Plant } from '@farm/plants/plant.model';
import { PlantServiceImplementation } from '@farm/plants/plant.service';
import { BehaviorSubject, filter, finalize, first, map, mergeMap, tap } from 'rxjs';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { AreaRouteParamsComponent } from '../../route-params.inheritable';
import { PlantIdIsUniqueValidator } from '../plant/plant-id-is-unique.validator';

@Component({
  selector: 'app-new-plant-form',
  templateUrl: './new-plant-form.component.html',
  styleUrls: ['./new-plant-form.component.css', '../../../../../../../styles/basic-form.css'],
  providers: [PlantIdIsUniqueValidator],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPlantFormComponent extends AreaRouteParamsComponent implements OnInit {
  protected plantService = inject(PlantServiceImplementation);
  protected plantFactory = new PlantFactory();
  protected plantIdIsUnique = inject(PlantIdIsUniqueValidator);
  private logService = inject(LogService);
  public newPlantFromGroup = new FormGroup({
    regularId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.plantIdIsUnique.validate.bind(this.plantIdIsUnique)],
    }),
    species: new FormControl('', [Validators.required]),
    startHeight: new FormControl(1, [Validators.required]),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  public plantIdError = this.newPlantFromGroup.statusChanges.pipe(
    filter((status) => status !== 'PENDING'),
    map(() => {
      return this.newPlantFromGroup.controls.regularId.errors
        ? Boolean(this.newPlantFromGroup.controls.regularId.errors['plantIdNotUnique'])
        : false;
    }),
  );
  @Output() submitted = new EventEmitter<void>();

  ngOnInit(): void {
    this.getFarmIdAndAreaId()
      .pipe(
        mergeMap(([farmId, areaId]) => this.plantService.getAll(farmId, areaId)),
        first(),
        map((result) => {
          if (result.empty) return [];
          return result.docs.map((doc) => doc.data() as Plant);
        }),
        map((plants) =>
          plants.reduce((regularId, plant) => (plant.regularId > regularId ? plant.regularId : regularId), 0),
        ),
      )
      .subscribe((latestId) => this.newPlantFromGroup.controls.regularId.setValue(latestId + 1, { emitEvent: true }));
  }

  protected createPlantData(): Plant {
    const regularId = this.newPlantFromGroup.controls.regularId.value!;
    const species = this.newPlantFromGroup.controls.species.value!.trim();
    return this.plantFactory.create({ regularId, species });
  }

  handleSubmit() {
    if (this.loadingSubject.value) return;
    this.loadingSubject.next(true);
    const plantData = this.createPlantData();
    this.getFarmIdAndAreaId()
      .pipe(
        tap({
          next: ([farmId]) => this.logService.addLog(farmId, LogActions.AddTree).subscribe(),
        }),
        mergeMap(([farmId, areaId]) => this.plantService.create(farmId, areaId, plantData)),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newPlantFromGroup.controls.regularId.setValue(this.newPlantFromGroup.controls.regularId.value! + 1);
        }),
      )
      .subscribe(() => this.submitted.emit());
  }
}
