import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from 'ngx-firebase-user-platform';
import { first, forkJoin, from, map, Observable, tap } from 'rxjs';
import { FarmModule } from './farm.module';
import { FarmService } from './farm.service';

@Injectable({
  providedIn: FarmModule,
})
export class MemberGuard  {
  constructor(private authService: AuthService, private farmService: FarmService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { farmId } = route.params;
    if (typeof farmId !== 'string') return false;
    return forkJoin([from(this.farmService.getFarm(farmId)), this.authService.getUid().pipe(first())]).pipe(
      map(([farm, uid]) => farm.adminMembers.includes(uid) || farm.observerMembers.includes(uid)),
      tap((isMember) => !isMember && this.router.navigateByUrl('/home')),
    );
  }
}
