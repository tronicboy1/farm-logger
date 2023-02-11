import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
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
} from 'rxjs';

@Injectable()
export class TreeNameIsUniqueValidator implements AsyncValidator {
  constructor(private treeService: TreeService, private route: ActivatedRoute) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const { value } = control;
    if (typeof value !== 'number') throw TypeError('Value must be number');
    const value$ = control.valueChanges.pipe(
      filter((value) => typeof value === 'number') as OperatorFunction<any, number>,
      sampleTime(100),
      take(1),
    );
    const observables = [...this.getFarmIdAndAreaIdObservables(), value$] as const;
    return forkJoin(observables).pipe(
      switchMap(([farmId, areaId, value]) => this.treeService.treeRegularIdIsUnique(farmId, areaId, value)),
      map((isUnique) => {
        if (isUnique) return null;
        return { treeIdNotUnique: true };
      }),
      catchError(() => of(null)),
    );
  }

  private getFarmIdAndAreaIdObservables() {
    return [
      this.route.parent!.params.pipe(
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
    ] as const;
  }
}
