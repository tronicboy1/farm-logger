import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, finalize, first, forkJoin, map, mergeMap } from "rxjs";
import { CropdustService } from "src/app/farm/cropdust.service";

@Component({
  selector: "app-new-cropdust-form",
  templateUrl: "./new-cropdust-form.component.html",
  styleUrls: ["./new-cropdust-form.component.css", "../../../../../../../styles/basic-form.css"],
})
export class NewCropdustFormComponent implements OnInit {
  public newFertilizationForm = new FormGroup({
    type: new FormControl("", [Validators.required]),
    note: new FormControl(""),
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  @Output() submitted = new EventEmitter<void>();

  constructor(private route: ActivatedRoute, private cropdustService: CropdustService) {}

  ngOnInit(): void {}

  public handleSubmit() {
    if (this.loadingSubject.value) return;
    const type = this.newFertilizationForm.controls.type.value!.trim();
    const note = this.newFertilizationForm.controls.note.value!.trim();
    this.getFarmIdAndAreaId()
      .pipe(
        mergeMap(([farmId, areaId]) =>
          this.cropdustService.addCropdust(farmId, areaId, { completedAt: Date.now(), type, note }),
        ),
        finalize(() => {
          this.loadingSubject.next(false);
          this.submitted.emit();
          this.newFertilizationForm.reset({ type: "", note: "" });
        }),
      )
      .subscribe();
  }

  private getFarmIdAndAreaId() {
    const params$ = [
      this.route.parent!.parent!.params.pipe(
        first(),
        map(({ farmId }) => {
          if (typeof farmId !== "string") throw TypeError("no farmId");
          return farmId;
        }),
      ),
      this.route.parent!.params.pipe(
        first(),
        map(({ areaId }) => {
          if (typeof areaId !== "string") throw TypeError("no areaId");
          return areaId;
        }),
      ),
    ] as const;
    return forkJoin(params$);
  }
}