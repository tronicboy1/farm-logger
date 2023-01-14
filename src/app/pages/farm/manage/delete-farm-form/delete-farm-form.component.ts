import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FarmService } from '@farm/farm.service';
import { mergeMap, tap } from 'rxjs';
import { ManageInheritable } from '../inheritable';
import { FarmNameIsCorrectValidator } from './farm-name-is-correct.validator';

@Component({
  selector: 'app-delete-farm-form',
  templateUrl: './delete-farm-form.component.html',
  styleUrls: ['./delete-farm-form.component.css', '../../../../../styles/basic-form.css'],
  providers: [FarmNameIsCorrectValidator],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteFarmFormComponent extends ManageInheritable {
  private farmNameIsCorrectValidator = inject(FarmNameIsCorrectValidator);
  private farmService = inject(FarmService);
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  readonly formGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.farmNameIsCorrectValidator.validate.bind(this.farmNameIsCorrectValidator)],
      nonNullable: true,
    }),
  });

  handleSubmit() {
    this.getFarmId()
      .pipe(mergeMap((farmId) => this.farmService.deleteFarm(farmId)))
      .subscribe(() => this.submitted.emit());
  }

  handleCancel() {
    this.cancel.emit();
  }
}
