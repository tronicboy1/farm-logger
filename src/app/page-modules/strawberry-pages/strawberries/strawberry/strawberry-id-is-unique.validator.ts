import { inject, Injectable } from '@angular/core';
import { AsyncValidator } from '@angular/forms';
import { StrawberryService } from '@farm/plants/strawberry/strawberry.service';
import { PlantIdIsUniqueValidator } from '@plant-pages/plants/plant/plant-id-is-unique.validator';

@Injectable()
export class StrawberryIdIsUniqueValidator extends PlantIdIsUniqueValidator implements AsyncValidator {
  protected plantService = inject(StrawberryService);
}
