import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StrawberryFactory } from '@farm/plants/strawberry/strawberry.factory';
import { StrawberryPlant } from '@farm/plants/strawberry/strawberry.model';
import { StrawberryService } from '@farm/plants/strawberry/strawberry.service';
import { NewPlantFormComponent } from '@plant-pages/plants/new-plant-form/new-plant-form.component';
import { PlantIdIsUniqueValidator } from '@plant-pages/plants/plant/plant-id-is-unique.validator';
import { StrawberryIdIsUniqueValidator } from '../strawberry/strawberry-id-is-unique.validator';

@Component({
  selector: 'app-new-strawberry-form',
  templateUrl: './new-strawberry-form.component.html',
  styleUrls: ['./new-strawberry-form.component.css', '../../../../../styles/basic-form.css'],
  providers: [PlantIdIsUniqueValidator, StrawberryIdIsUniqueValidator],
})
export class NewStrawberryFormComponent extends NewPlantFormComponent {
  protected plantService = inject(StrawberryService);
  protected plantFactory = new StrawberryFactory();
  protected plantIdIsUnique = inject(StrawberryIdIsUniqueValidator);
  newPlantFromGroup = new FormGroup({
    regularId: new FormControl<number>(0, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.plantIdIsUnique.validate.bind(this.plantIdIsUnique)],
      nonNullable: true,
    }),
    species: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    startingWidth: new FormControl(1, { nonNullable: true }),
  });

  protected createPlantData(): StrawberryPlant {
    const regularId = this.newPlantFromGroup.controls.regularId.value;
    const species = this.newPlantFromGroup.controls.species.value.trim();
    const startingWidth = this.newPlantFromGroup.controls.startingWidth.value;
    return this.plantFactory.create({ regularId, species, startingWidth });
  }
}
