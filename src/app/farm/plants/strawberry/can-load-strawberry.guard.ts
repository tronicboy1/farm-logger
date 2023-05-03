import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AreaService } from '@farm/area.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { PlantTypes } from '../plant.model';

@Injectable({
  providedIn: 'root',
})
export class CanLoadStrawberryGuard  {
  private areaService = inject(AreaService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return of(route.params).pipe(
      switchMap(({ areaId, farmId }) => this.areaService.getArea(farmId, areaId)),
      map((area) => (area.plantType === PlantTypes.StrawberryPlant ? true : this.router.parseUrl('home'))),
    );
  }
}
