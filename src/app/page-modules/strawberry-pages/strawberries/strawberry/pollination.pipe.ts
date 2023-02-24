import { Pipe, PipeTransform } from '@angular/core';
import { StrawberryReport } from '@farm/plants/strawberry/strawberry.model';

@Pipe({
  name: 'pollination'
})
export class PollinationPipe implements PipeTransform {

  transform(value: StrawberryReport['pollination']): string {
    return value ? 'O' : '-';
  }

}
