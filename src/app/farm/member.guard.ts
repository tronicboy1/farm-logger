import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "@user/auth.service";
import { first, forkJoin, from, map, mergeMap, Observable, switchMap, tap } from "rxjs";
import { FarmModule } from "./farm.module";
import { FarmService } from "./farm.service";

@Injectable({
  providedIn: FarmModule,
})
export class MemberGuard implements CanActivate {
  constructor(private authService: AuthService, private farmService: FarmService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { farmId } = route.params;
    if (typeof farmId !== "string") return false;
    return forkJoin([from(this.farmService.getFarm(farmId)), this.authService.getUid().pipe(first())]).pipe(
      map(([farm, uid]) => farm.adminMembers.includes(uid) || farm.observerMembers.includes(uid)),
      tap((isMember) => !isMember && this.router.navigateByUrl("/farms")),
    );
  }
}
