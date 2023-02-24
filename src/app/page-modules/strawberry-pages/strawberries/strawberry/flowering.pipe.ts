import { Pipe, PipeTransform } from '@angular/core';
import { StrawberryFlowering, strawberryFloweringTypes } from '@farm/plants/strawberry/strawberry.model';

@Pipe({
  name: 'floweringText',
})
export class FloweringPipe implements PipeTransform {
  transform(value: StrawberryFlowering): string | undefined {
    return strawberryFloweringTypes.get(value);
  }
}
