import { inject, Injectable } from '@angular/core';
import { AsyncValidator } from '@angular/forms';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { PlantIdIsUniqueValidator } from '@plants-pages-module/plants/plant/plant-id-is-unique.validator';

@Injectable()
export class TreeIdIsUniqueValidator extends PlantIdIsUniqueValidator implements AsyncValidator {
  protected plantService = inject(TreeService);
}
