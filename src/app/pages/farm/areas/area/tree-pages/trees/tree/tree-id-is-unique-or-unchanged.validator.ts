import { inject, Injectable } from '@angular/core';
import { AsyncValidator } from '@angular/forms';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { PlantIdIsUniqueOrUnchangedValidator } from '@plants-pages-module/plants/plant/plant-id-is-unique-or-unchanged.validator';

@Injectable()
export class TreeIdIsUniqueOrUnchangedValidator extends PlantIdIsUniqueOrUnchangedValidator implements AsyncValidator {
  protected plantService = inject(TreeService);
}
