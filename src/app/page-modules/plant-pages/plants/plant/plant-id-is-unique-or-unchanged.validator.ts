import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { PlantServiceImplementation } from '@farm/plants/plant.service';
import { catchError, filter, forkJoin, map, Observable, of, OperatorFunction, sampleTime, switchMap, take } from 'rxjs';
import { PlantIdInheritable } from './plant-id.inhertible';

@Injectable()
export class PlantIdIsUniqueOrUnchangedValidator extends PlantIdInheritable implements AsyncValidator {
  protected plantService = inject(PlantServiceImplementation);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const { value } = control;
    if (typeof value !== 'number') throw TypeError('Value must be number');
    const value$ = control.valueChanges.pipe(
      filter((value) => typeof value === 'number') as OperatorFunction<any, number>,
      sampleTime(100),
      take(1),
    );
    return forkJoin([this.getFarmIdAreaIdAndPlantId(), value$]).pipe(
      switchMap(([[farmId, areaId, plantId], value]) =>
        forkJoin([
          this.plantService.get(farmId, areaId, plantId),
          this.plantService.regularIdIsUnique(farmId, areaId, value),
        ]),
      ),
      map(([plant, isUnique]) => {
        const isUnchanged = value === plant.regularId;
        if (isUnique || isUnchanged) return null;
        return { plantIdNotUnique: true };
      }),
      catchError(() => of(null)),
    );
  }
}
