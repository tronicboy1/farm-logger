import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoffeeTreeFactory } from '@farm/plants/coffee-tree/tree.factory';
import { CoffeeTree, CoffeeTreeForm } from '@farm/plants/coffee-tree/tree.model';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { filter, first, map, mergeMap } from 'rxjs';
import { EditPlantFormComponent } from '@plant-pages/plants/plant/edit-plant-form/edit-plant-form.component';
import { PlantIdIsUniqueOrUnchangedValidator } from '@plant-pages/plants/plant/plant-id-is-unique-or-unchanged.validator';
import { TreeIdIsUniqueOrUnchangedValidator } from '../tree-id-is-unique-or-unchanged.validator';

@Component({
  selector: 'farm-edit-tree-form',
  templateUrl: './edit-tree-form.component.html',
  styleUrls: ['./edit-tree-form.component.css', '../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeIdIsUniqueOrUnchangedValidator, PlantIdIsUniqueOrUnchangedValidator],
})
export class EditTreeFormComponent extends EditPlantFormComponent implements OnInit {
  protected plantService = inject(TreeService);
  protected plantFactory = new CoffeeTreeFactory();
  protected plantIdIsUnique = inject(TreeIdIsUniqueOrUnchangedValidator);
  formGroup = new FormGroup<CoffeeTreeForm>({
    regularId: new FormControl(0, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.plantIdIsUnique.validate.bind(this.plantIdIsUnique)],
      nonNullable: true,
    }),
    species: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    startHeight: new FormControl(0, { validators: [Validators.min(1), Validators.required], nonNullable: true }),
  });
  plantIdError$ = this.formGroup.statusChanges.pipe(
    filter((status) => status !== 'PENDING'),
    map(() => {
      return this.formGroup.controls.regularId.errors
        ? Boolean(this.formGroup.controls.regularId.errors['plantIdNotUnique'])
        : false;
    }),
  );

  ngOnInit(): void {
    this.getFarmIdAreaIdAndPlantId()
      .pipe(
        mergeMap(([farmId, areaId, treeId]) => this.plantService.get(farmId, areaId, treeId)),
        first(),
      )
      .subscribe((tree) => {
        this.originalRegularIdCache = tree.regularId;
        this.formGroup.controls.regularId.setValue(tree.regularId);
        this.formGroup.controls.species.setValue(tree.species);
        this.formGroup.controls.startHeight.setValue(tree.startHeight);
      });
  }

  protected createPlantData(): CoffeeTree {
    const regularId = this.formGroup.controls['regularId'].value;
    const species = this.formGroup.controls['species'].value;
    const startHeight = this.formGroup.controls.startHeight.value;
    return this.plantFactory.create({ regularId, species, startHeight });
  }
}
