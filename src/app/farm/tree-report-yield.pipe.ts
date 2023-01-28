import { Pipe, PipeTransform } from '@angular/core';
import { YieldConditions, yieldConditionsText } from './tree.model';

@Pipe({
  name: 'treeReportYield',
})
export class TreeReportYieldPipe implements PipeTransform {
  transform(value: YieldConditions | string): string {
    return typeof value === 'number' ? yieldConditionsText.get(value) ?? '' : value;
  }
}
