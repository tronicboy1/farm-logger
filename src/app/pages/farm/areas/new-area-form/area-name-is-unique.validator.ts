import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  catchError,
  filter,
  first,
  forkJoin,
  map,
  Observable,
  of,
  OperatorFunction,
  sampleTime,
  switchMap,
  take,
  tap,
} from "rxjs";
import { AreaService } from "src/app/farm/area.service";

@Injectable()
export class AreaNameIsUniqueValidator implements AsyncValidator {
  constructor(private areaService: AreaService, private route: ActivatedRoute) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const { value } = control;
    if (typeof value !== "string") throw TypeError("V");
    const farmId$ = this.route.parent!.params.pipe(
      first(),
      map((params) => {
        const { farmId } = params;
        if (typeof farmId !== "string") throw TypeError();
        return farmId;
      }),
    );
    const value$ = control.valueChanges.pipe(
      filter((value) => typeof value === "string") as OperatorFunction<any, string>,
      sampleTime(1000),
      take(1),
    );
    const observables = [farmId$, value$] as const;
    return forkJoin(observables).pipe(
      switchMap(([farmId, value]) => this.areaService.farmNameIsUnique(farmId, value)),
      map((isUnique) => {
        if (isUnique) return null;
        return { areaNameNotUnique: true };
      }),
      catchError(() => of(null)),
    );
  }
}
