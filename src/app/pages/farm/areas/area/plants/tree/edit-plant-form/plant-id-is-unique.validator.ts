import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { PlantService } from '@farm/plants/plant.service';
import { catchError, filter, forkJoin, map, Observable, of, OperatorFunction, sampleTime, switchMap, take } from 'rxjs';
import { PlantIdInheritable } from '../plant-id.inhertible';

@Injectable()
export class PlantIdIsUniqueValidator extends PlantIdInheritable implements AsyncValidator {
  protected plantService = inject(PlantService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const { value } = control;
    if (typeof value !== 'number') throw TypeError('Value must be number');
    const value$ = control.valueChanges.pipe(
      filter((value) => typeof value === 'number') as OperatorFunction<any, number>,
      sampleTime(100),
      take(1),
    );
    return forkJoin([this.getFarmIdAreaIdAndPlantId(), value$]).pipe(
      switchMap(([[farmId, areaId], value]) => this.plantService.regularIdIsUnique(farmId, areaId, value)),
      map((isUnique) => {
        if (isUnique) return null;
        return { plantIdNotUnique: true };
      }),
      catchError(() => of(null)),
    );
  }
}
