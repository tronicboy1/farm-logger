import { inject, Injectable } from '@angular/core';
import { AsyncValidator } from '@angular/forms';
import { StrawberryService } from '@farm/plants/strawberry/strawberry.service';
import { PlantIdIsUniqueOrUnchangedValidator } from '@plant-pages/plants/plant/plant-id-is-unique-or-unchanged.validator';

@Injectable()
export class StrawberryIdIsUniqueOrUnchangedValidator
  extends PlantIdIsUniqueOrUnchangedValidator
  implements AsyncValidator
{
  protected plantService = inject(StrawberryService);
}
