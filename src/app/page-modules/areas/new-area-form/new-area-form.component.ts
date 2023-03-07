import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { plantTypeNames } from '@farm/plants/plant.model';
import { BehaviorSubject, finalize, first, forkJoin, map, mergeMap, of } from 'rxjs';
import { AreaService } from 'src/app/farm/area.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';
import { AreaNameIsUniqueValidator } from './area-name-is-unique.validator';

@Component({
  selector: 'app-new-area-form',
  templateUrl: './new-area-form.component.html',
  styleUrls: ['./new-area-form.component.css', '../../../../styles/basic-form.css'],
  providers: [AreaNameIsUniqueValidator],
})
export class NewAreaFormComponent implements OnInit {
  plantTypes = Array.from(plantTypeNames);
  private loadingSubject = new BehaviorSubject(false);
  public loading = this.loadingSubject.asObservable();
  public newAreaFormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [this.areaNameValidator.validate.bind(this.areaNameValidator)],
    }),
    plantType: new FormControl(1, { validators: [Validators.required], nonNullable: true }),
  });

  constructor(
    private areaNameValidator: AreaNameIsUniqueValidator,
    private areaService: AreaService,
    private route: ActivatedRoute,
    private logService: LogService,
  ) {}

  ngOnInit(): void {}

  handleSubmit() {
    if (this.loadingSubject.value) return;
    const name = this.newAreaFormGroup.controls.name.value!.trim();
    const plantType = this.newAreaFormGroup.controls.plantType.value;
    this.loadingSubject.next(true);
    this.route
      .parent!.params.pipe(
        first(),
        map((params) => {
          const { farmId } = params;
          if (typeof farmId !== 'string') throw TypeError();
          return farmId;
        }),
        mergeMap((farmId) =>
          forkJoin([this.areaService.createArea(farmId, { name, createdAt: Date.now(), plantType }), of(farmId)]),
        ),
        mergeMap(([ref, farmId]) => {
          return this.logService.addLog(farmId, LogActions.AddArea, ref.id);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newAreaFormGroup.reset();
        }),
      )
      .subscribe();
  }
}
