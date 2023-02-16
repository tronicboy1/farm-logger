import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, filter, first, map, mergeMap, tap } from 'rxjs';
import { PlantIdInheritable } from '../plant-id.inhertible';
import { PlantIdIsUniqueValidator } from '../plant-id-is-unique.validator';
import { PlantServiceImplementation } from '@farm/plants/plant.service';
import { PlantFactory } from '@farm/plants/plant.factory';
import { Plant } from '@farm/plants/plant.model';
import { PlantIdIsUniqueOrUnchangedValidator } from '../plant-id-is-unique-or-unchanged.validator';

@Component({
  selector: 'farm-edit-plant-form',
  templateUrl: './edit-plant-form.component.html',
  styleUrls: ['./edit-plant-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlantIdIsUniqueOrUnchangedValidator],
})
export class EditPlantFormComponent extends PlantIdInheritable implements OnInit {
  protected plantService = inject(PlantServiceImplementation);
  protected plantIdIsUnique = inject(PlantIdIsUniqueOrUnchangedValidator);
  protected plantFactory = new PlantFactory();
  readonly formGroup: FormGroup = new FormGroup({
    regularId: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.plantIdIsUnique.validate.bind(this.plantIdIsUnique)],
      nonNullable: true,
    }),
    species: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });
  readonly loading$ = new BehaviorSubject(false);
  originalRegularIdCache?: number;
  plantIdError$ = this.formGroup.statusChanges.pipe(
    filter((status) => status !== 'PENDING'),
    map(() =>
      this.formGroup.controls['regularId'].errors
        ? Boolean(this.formGroup.controls['regularId'].errors['plantIdNotUnique'])
        : false,
    ),
  );
  @Output() submitted = new EventEmitter<void>();

  ngOnInit(): void {
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, plantId]) => this.plantService.get(farmId, areaId, plantId)),
        first(),
      )
      .subscribe((plant) => {
        this.originalRegularIdCache = plant.regularId;
        this.formGroup.controls['regularId'].setValue(plant.regularId);
        this.formGroup.controls['species'].setValue(plant.species);
      });
  }

  protected createPlantData(): Plant {
    const regularId = this.formGroup.controls['regularId'].value;
    const species = this.formGroup.controls['species'].value;
    return this.plantFactory.create({ regularId, species });
  }

  handleSubmit() {
    if (this.loading$.value || this.formGroup.invalid) return;
    this.loading$.next(true);
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, plantId]) =>
          this.plantService.update(farmId, areaId, plantId, this.createPlantData()),
        ),
        tap({ next: () => this.submitted.emit(), finalize: () => this.loading$.next(false) }),
      )
      .subscribe();
  }
}
