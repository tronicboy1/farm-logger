import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { UserModule } from "./user.module";

@Injectable({
  providedIn: UserModule,
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getAuthState().pipe(
      map((user) => {
        const isAuth = Boolean(user);
        /** to be fixed : https://github.com/angular/angular/issues/16211 */
        if (!isAuth) this.router.navigateByUrl("/auth");
        return isAuth;
      }),
    );
  }
}
