import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, finalize, first, map, mergeMap, Observable } from 'rxjs';
import { AreaWithId } from 'src/app/farm/area.model';
import { AreaService } from 'src/app/farm/area.service';

@Component({
  selector: 'app-delete-area-form',
  templateUrl: './delete-area-form.component.html',
  styleUrls: ['./delete-area-form.component.css', '../../../../../styles/basic-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAreaFormComponent {
  @Input() areas$!: Observable<AreaWithId[]>;
  @Output() submitted = new EventEmitter<void>();
  deleteFormGroup = new FormGroup({
    areas: new FormControl<string[]>([], [Validators.required]),
  });

  showConfirmForm$ = new BehaviorSubject(false);

  constructor(private areaService: AreaService, private route: ActivatedRoute) {}

  handleSubmit(event: Event) {
    event.preventDefault();
    const areaIds = this.deleteFormGroup.controls.areas.value!;
    this.route
      .parent!.params.pipe(
        first(),
        map((params) => {
          const { farmId } = params;
          if (typeof farmId !== 'string') throw TypeError();
          return farmId;
        }),
        mergeMap((farmId) => this.areaService.deleteAreas(farmId, areaIds)),
        finalize(() => {
          this.showConfirmForm$.next(false);
          this.submitted.emit();
        }),
      )
      .subscribe();
  }

  toggleConfirmForm = (force?: boolean) => this.showConfirmForm$.next(force ?? !this.showConfirmForm$.value);
}
