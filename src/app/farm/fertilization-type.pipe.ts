import { Pipe, PipeTransform } from '@angular/core';
import { FertilizationType, fertilizationTypeText } from './fertilization.model';

@Pipe({
  name: 'fertilizationType',
})
export class FertilizationTypePipe implements PipeTransform {
  transform(value: FertilizationType | string): string {
    return typeof value === 'number' ? fertilizationTypeText.get(value) ?? '' : value;
  }
}
