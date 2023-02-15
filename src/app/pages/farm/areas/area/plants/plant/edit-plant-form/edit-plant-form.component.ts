import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, filter, first, map, mergeMap, tap } from 'rxjs';
import { PlantIdInheritable } from '../plant-id.inhertible';
import { PlantIdIsUniqueValidator } from '../plant-id-is-unique.validator';
import { PlantServiceImplementation } from '@farm/plants/plant.service';

@Component({
  selector: 'farm-edit-plant-form',
  templateUrl: './edit-plant-form.component.html',
  styleUrls: ['./edit-plant-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlantIdIsUniqueValidator],
})
export class EditPlantFormComponent extends PlantIdInheritable implements OnInit {
  protected plantService = inject(PlantServiceImplementation);
  private plantIdIsUnique = inject(PlantIdIsUniqueValidator);
  readonly formGroup = new FormGroup({
    regularId: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.plantIdIsUnique.validate.bind(this.plantIdIsUnique)],
      nonNullable: true,
    }),
    species: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });
  readonly loading$ = new BehaviorSubject(false);
  readonly plantIdError$ = this.formGroup.statusChanges.pipe(
    filter((status) => status !== 'PENDING'),
    map(() => {
      return this.formGroup.controls.regularId.errors
        ? Boolean(this.formGroup.controls.regularId.errors['plantIdNotUnique'])
        : false;
    }),
  );
  @Output() submitted = new EventEmitter<void>();

  ngOnInit(): void {
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, plantId]) => this.plantService.get(farmId, areaId, plantId)),
        first(),
      )
      .subscribe((plant) => {
        this.formGroup.controls.regularId.setValue(plant.regularId);
        this.formGroup.controls.species.setValue(plant.species);
      });
  }

  handleSubmit() {
    if (this.loading$.value || this.formGroup.invalid) return;
    const regularId = this.formGroup.controls.regularId.value;
    const species = this.formGroup.controls.species.value;
    this.loading$.next(true);
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, plantId]) =>
          this.plantService.update(farmId, areaId, plantId, { regularId, species }),
        ),
        tap({ next: () => this.submitted.emit(), finalize: () => this.loading$.next(false) }),
      )
      .subscribe();
  }
}
