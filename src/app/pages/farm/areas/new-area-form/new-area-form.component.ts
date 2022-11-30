import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, finalize, first, map, mergeMap, Subject, tap } from "rxjs";
import { AreaService } from "src/app/farm/area.service";
import { AreaNameIsUniqueValidator } from "./area-name-is-unique.validator";

@Component({
  selector: "app-new-area-form",
  templateUrl: "./new-area-form.component.html",
  styleUrls: ["./new-area-form.component.css", "../../../../../styles/basic-form.css"],
  providers: [AreaNameIsUniqueValidator],
})
export class NewAreaFormComponent implements OnInit {
  private loadingSubject = new BehaviorSubject(false);
  public loading = this.loadingSubject.asObservable();
  public newAreaFormGroup = new FormGroup({
    name: new FormControl("", {
      validators: [Validators.required],
      asyncValidators: [this.areaNameValidator.validate.bind(this.areaNameValidator)],
    }),
  });

  constructor(
    private areaNameValidator: AreaNameIsUniqueValidator,
    private areaService: AreaService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {}

  handleSubmit() {
    if (this.loadingSubject.value) return;
    const name = this.newAreaFormGroup.controls.name.value!.trim();
    this.loadingSubject.next(true);
    this.route
      .parent!.params.pipe(
        first(),
        map((params) => {
          const { farmId } = params;
          if (typeof farmId !== "string") throw TypeError();
          return farmId;
        }),
        mergeMap((farmId) => this.areaService.createArea(farmId, { name, createdAt: Date.now() })),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newAreaFormGroup.reset();
        }),
      )
      .subscribe();
  }
}
