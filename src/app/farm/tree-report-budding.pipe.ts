import { Pipe, PipeTransform } from '@angular/core';
import { BuddingConditions, buddingConditionsText } from './tree.model';

@Pipe({
  name: 'treeReportBudding',
})
export class TreeReportBuddingPipe implements PipeTransform {
  transform(value: BuddingConditions | string): string {
    return typeof value === 'number' ? buddingConditionsText.get(value) ?? '' : value;
  }
}
