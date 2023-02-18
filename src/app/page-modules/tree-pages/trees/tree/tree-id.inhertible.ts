import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, forkJoin, map } from 'rxjs';

export class TreeIdInheritable {
  private route = inject(ActivatedRoute);
  protected getFarmIdAreaIdAndTreeId() {
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
        map(({ treeId }) => {
          if (typeof treeId !== 'string') throw TypeError('no treeId');
          return treeId;
        }),
      ),
    ] as const;
    return forkJoin(params$);
  }
}
