import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoffeeTreeForm } from '@farm/plants/coffee-tree/tree.model';
import { PlantService } from '@farm/plants/plant.service';
import { BehaviorSubject, filter, first, map, mergeMap, tap } from 'rxjs';
import { PlantIdInheritable } from '../plant-id.inhertible';
import { PlantIdIsUniqueValidator } from './plant-id-is-unique.validator';

@Component({
  selector: 'farm-edit-plant-form',
  templateUrl: './edit-plant-form.component.html',
  styleUrls: ['./edit-plant-form.component.css', '../../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlantIdIsUniqueValidator],
})
export class EditPlantFormComponent extends PlantIdInheritable implements OnInit {
  protected plantService = inject(PlantService);
  private plantIdIsUnique = inject(PlantIdIsUniqueValidator);
  readonly formGroup = new FormGroup<CoffeeTreeForm>({
    regularId: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.plantIdIsUnique.validate.bind(this.plantIdIsUnique)],
      nonNullable: true,
    }),
    species: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    startHeight: new FormControl(0, { validators: [Validators.min(1), Validators.required], nonNullable: true }),
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
        this.formGroup.controls.startHeight.setValue(plant.startHeight);
      });
  }

  handleSubmit() {
    if (this.loading$.value || this.formGroup.invalid) return;
    const regularId = this.formGroup.controls.regularId.value;
    const species = this.formGroup.controls.species.value;
    const startHeight = this.formGroup.controls.startHeight.value;
    this.loading$.next(true);
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, plantId]) =>
          this.plantService.update(farmId, areaId, plantId, { regularId, species, startHeight }),
        ),
        tap({ next: () => this.submitted.emit(), finalize: () => this.loading$.next(false) }),
      )
      .subscribe();
  }
}
