import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs';

export class ManageInheritable {
  protected route = inject(ActivatedRoute);
  protected getFarmId() {
    return this.route.parent!.params.pipe(
      first(),
      map(({ farmId }) => {
        if (typeof farmId !== 'string') throw TypeError('Farm ID was not in params.');
        return farmId;
      }),
    );
  }
}
