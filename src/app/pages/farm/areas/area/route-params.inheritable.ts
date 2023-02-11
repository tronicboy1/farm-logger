import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { filter, first, forkJoin, map } from 'rxjs';
import { AreaService } from 'src/app/farm/area.service';

export class AreaRouteParamsComponent {
  protected areaService = inject(AreaService);
  protected route = inject(ActivatedRoute);
  protected treeService = inject(TreeService);

  protected getFarmIdAndAreaId() {
    const params$ = [
      this.route.parent!.parent!.params.pipe(
        filter(({ farmId }) => Boolean(farmId)),
        map(({ farmId }) => {
          if (typeof farmId !== 'string') throw TypeError('no farmId');
          return farmId;
        }),
      ),
      this.route.parent!.params.pipe(
        filter(({ areaId }) => Boolean(areaId)),
        map(({ areaId }) => {
          if (typeof areaId !== 'string') throw TypeError('no areaId');
          return areaId;
        }),
      ),
    ].map((param$) => param$.pipe(first()));
    return forkJoin(params$);
  }
}
