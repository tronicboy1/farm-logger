import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize, first, forkJoin, map, mergeMap, tap } from 'rxjs';
import { CropdustService } from 'src/app/farm/cropdust.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { AreaRouteParamsComponent } from '../../route-params.inheritable';

@Component({
  selector: 'app-new-cropdust-form',
  templateUrl: './new-cropdust-form.component.html',
  styleUrls: ['./new-cropdust-form.component.css', '../../../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCropdustFormComponent extends AreaRouteParamsComponent implements OnInit {
  public newFertilizationForm = new FormGroup({
    type: new FormControl('', [Validators.required]),
    note: new FormControl(''),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  @Output() submitted = new EventEmitter<void>();

  constructor(private cropdustService: CropdustService, private logService: LogService) {
    super();
  }

  ngOnInit(): void {}

  public handleSubmit() {
    if (this.loadingSubject.value) return;
    const type = this.newFertilizationForm.controls.type.value!.trim();
    const note = this.newFertilizationForm.controls.note.value!.trim();
    this.getFarmIdAndAreaId()
      .pipe(
        tap({
          next: ([farmId]) => this.logService.addLog(farmId, LogActions.AddCropdust).subscribe(),
        }),
        mergeMap(([farmId, areaId]) =>
          this.cropdustService.addCropdust(farmId, areaId, { completedAt: Date.now(), type, note }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.submitted.emit();
          this.newFertilizationForm.reset({ type: '', note: '' });
        }),
      )
      .subscribe();
  }
}
