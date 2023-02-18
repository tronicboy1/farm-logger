import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoffeeTree } from '@farm/plants/coffee-tree/tree.model';
import { CoffeeTreeFactory } from '@farm/plants/coffee-tree/tree.factory';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { filter, first, map, mergeMap } from 'rxjs';
import { TreeIdIsUniqueValidator } from '../tree/tree-id-is-unique.validator';
import { PlantIdIsUniqueValidator } from '@plants-pages-module/plants/plant/plant-id-is-unique.validator';
import { NewPlantFormComponent } from '@plants-pages-module/plants/new-plant-form/new-plant-form.component';

@Component({
  selector: 'app-new-tree-form',
  templateUrl: './new-tree-form.component.html',
  styleUrls: ['./new-tree-form.component.css', '../../../../../../../../styles/basic-form.css'],
  providers: [PlantIdIsUniqueValidator, TreeIdIsUniqueValidator],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTreeFormComponent extends NewPlantFormComponent implements OnInit {
  protected plantService = inject(TreeService);
  protected plantFactory = new CoffeeTreeFactory();
  protected plantIdIsUnique = inject(TreeIdIsUniqueValidator);
  public newPlantFromGroup = new FormGroup({
    regularId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.plantIdIsUnique.validate.bind(this.plantIdIsUnique)],
    }),
    species: new FormControl('', [Validators.required]),
    startHeight: new FormControl(1, [Validators.required]),
  });
  public treeIdError = this.newPlantFromGroup.statusChanges.pipe(
    filter((status) => status !== 'PENDING'),
    map(() => {
      return this.newPlantFromGroup.controls.regularId.errors
        ? Boolean(this.newPlantFromGroup.controls.regularId.errors['plantIdNotUnique'])
        : false;
    }),
  );

  ngOnInit(): void {
    this.getFarmIdAndAreaId()
      .pipe(
        mergeMap(([farmId, areaId]) => this.plantService.getAll(farmId, areaId)),
        first(),
        map((result) => {
          if (result.empty) return [];
          return result.docs.map((doc) => doc.data() as CoffeeTree);
        }),
        map((trees) => trees.reduce((regularId, tree) => (tree.regularId > regularId ? tree.regularId : regularId), 0)),
      )
      .subscribe((latestId) => this.newPlantFromGroup.controls.regularId.setValue(latestId + 1, { emitEvent: true }));
  }

  protected createPlantData(): CoffeeTree {
    const regularId = this.newPlantFromGroup.controls.regularId.value!;
    const species = this.newPlantFromGroup.controls.species.value!.trim();
    const startHeight = this.newPlantFromGroup.controls.startHeight.value!;
    return this.plantFactory.create({ regularId, species, startHeight });
  }
}
