import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FertilizationType, fertilizationTypeText } from '@farm/fertilization.model';
import { BehaviorSubject, finalize, mergeMap, tap } from 'rxjs';
import { FertilizationService } from 'src/app/farm/fertilization.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { AreaRouteParamsComponent } from '../../route-params.inheritable';

@Component({
  selector: 'app-new-fertilization-form',
  templateUrl: './new-fertilization-form.component.html',
  styleUrls: ['./new-fertilization-form.component.css', '../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewFertilizationFormComponent extends AreaRouteParamsComponent {
  readonly typeOptions = Array.from(fertilizationTypeText.entries()).map(([value, name]) => ({ value, name }));
  public newFertilizationForm = new FormGroup({
    type: new FormControl<FertilizationType>(FertilizationType.Watering, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    note: new FormControl('', { nonNullable: true }),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  @Output() submitted = new EventEmitter<void>();

  constructor(private fertilizationService: FertilizationService, private logService: LogService) {
    super();
  }

  public handleSubmit() {
    if (this.loadingSubject.value) return;
    const type = this.newFertilizationForm.controls.type.value;
    const note = this.newFertilizationForm.controls.note.value.trim();
    this.getFarmIdAndAreaId()
      .pipe(
        tap({
          next: ([farmId]) => this.logService.addLog(farmId, LogActions.AddFertilization).subscribe(),
        }),
        mergeMap(([farmId, areaId]) =>
          this.fertilizationService.addFertilization(farmId, areaId, { completedAt: Date.now(), type, note }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.submitted.emit();
          this.newFertilizationForm.reset({ type: FertilizationType.Watering, note: '' });
        }),
      )
      .subscribe();
  }
}
