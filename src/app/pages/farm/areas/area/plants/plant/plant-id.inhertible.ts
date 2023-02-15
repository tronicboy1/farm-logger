import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, forkJoin, map } from 'rxjs';

export class PlantIdInheritable {
  private route = inject(ActivatedRoute);
  protected getFarmIdAreaIdAndPlantId() {
    const params$ = [
      this.route.parent!.parent!.params.pipe(
        first(),
        map(({ farmId }) => {
          if (typeof farmId !== 'string') throw TypeError('no farmId');
          return farmId;
        }),
      ),
      this.route.parent!.params.pipe(
        first(),
        map(({ areaId }) => {
          if (typeof areaId !== 'string') throw TypeError('no areaId');
          return areaId;
        }),
      ),
      this.route.params.pipe(
        first(),
        map(({ plantId }) => {
          if (typeof plantId !== 'string') throw TypeError('no plantId');
          return plantId;
        }),
      ),
    ] as const;
    return forkJoin(params$);
  }
}
