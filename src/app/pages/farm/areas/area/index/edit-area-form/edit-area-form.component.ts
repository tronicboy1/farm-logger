import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, mergeMap, tap } from 'rxjs';
import { AreaRouteParamsComponent } from '../../route-params.inheritable';

@Component({
  selector: 'farm-edit-area-form',
  templateUrl: './edit-area-form.component.html',
  styleUrls: ['./edit-area-form.component.css', '../../../../../../../styles/basic-form.css'],
})
export class EditAreaFormComponent extends AreaRouteParamsComponent implements OnInit {
  @Output() submitted = new EventEmitter<void>();
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
  loading$ = new BehaviorSubject(false);

  ngOnInit() {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.areaService.getArea(farmId, areaId)))
      .subscribe((area) => {
        this.formGroup.controls.name.setValue(area.name);
      });
  }

  handleSubmit() {
    if (this.loading$.getValue()) return;
    const name = this.formGroup.value.name!;
    this.loading$.next(true);
    this.getFarmIdAndAreaId()
      .pipe(
        mergeMap(([farmId, areaId]) => this.areaService.updateArea(farmId, areaId, { name })),
        tap({ next: () => this.submitted.emit(), finalize: () => this.loading$.next(false) }),
      )
      .subscribe();
  }
}
