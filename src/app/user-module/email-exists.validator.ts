import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { UserService } from "@user/user.service";
import { catchError, from, map, Observable, of } from "rxjs";
import { UserModule } from "./user.module";

@Injectable({ providedIn: UserModule })
export class EmailExistsValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const { value } = control;
    if (typeof value !== "string") throw TypeError("V");
    return from(this.userService.getUserByEmail(control.value)).pipe(
      map((userData) => {
        if (userData) return null;
        return { userDoesNotExist: true };
      }),
      catchError(() => of(null)),
    );
  }
}
