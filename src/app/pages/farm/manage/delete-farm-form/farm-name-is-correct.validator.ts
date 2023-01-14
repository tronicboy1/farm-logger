import { inject, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { FarmService } from '@farm/farm.service';
import { first, map, mergeMap, Observable } from 'rxjs';
import { ManageInheritable } from '../inheritable';

@Injectable()
export class FarmNameIsCorrectValidator extends ManageInheritable implements AsyncValidator {
  private farmService = inject(FarmService);

  validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.getFarmId().pipe(
      mergeMap((farmId) => this.farmService.getFarm(farmId)),
      map((farm) => farm.name),
      map((farmName) => (control.value === farmName ? null : { farmNameDoesNotMatch: true })),
    );
  }
}
