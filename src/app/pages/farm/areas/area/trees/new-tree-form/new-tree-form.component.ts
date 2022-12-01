import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, filter, finalize, first, forkJoin, map, mergeMap, tap } from "rxjs";
import { TreeService } from "src/app/farm/tree.service";
import { TreeNameIsUniqueValidator } from "./tree-name-is-unique.validator";

@Component({
  selector: "app-new-tree-form",
  templateUrl: "./new-tree-form.component.html",
  styleUrls: ["./new-tree-form.component.css", "../../../../../../../styles/basic-form.css"],
  providers: [TreeNameIsUniqueValidator],
})
export class NewTreeFormComponent implements OnInit {
  public newTreeFromGroup = new FormGroup({
    regularId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
      asyncValidators: [this.treeNameIsUnique.validate.bind(this.treeNameIsUnique)],
    }),
    species: new FormControl("", [Validators.required]),
    startHeight: new FormControl(1, [Validators.required])
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  public treeIdError = this.newTreeFromGroup.statusChanges.pipe(
    filter((status) => status !== "PENDING"),
    map(() => {
      return this.newTreeFromGroup.controls.regularId.errors
        ? Boolean(this.newTreeFromGroup.controls.regularId.errors["treeIdNotUnique"])
        : false;
    }),
  );

  constructor(
    private route: ActivatedRoute,
    private treeService: TreeService,
    private treeNameIsUnique: TreeNameIsUniqueValidator,
  ) {}

  ngOnInit(): void {}

  handleSubmit() {
    if (this.loadingSubject.value) return;
    this.loadingSubject.next(true);
    const regularId = this.newTreeFromGroup.controls.regularId.value!;
    const species = this.newTreeFromGroup.controls.species.value!.trim();
    const startHeight = this.newTreeFromGroup.controls.startHeight.value!;
    this.getFarmIdAndAreaId()
      .pipe(
        mergeMap(([farmId, areaId]) => this.treeService.createTree(farmId, areaId, { regularId, species, startHeight })),
        finalize(() => {
          this.loadingSubject.next(false);
          this.newTreeFromGroup.controls.regularId.setValue(this.newTreeFromGroup.controls.regularId.value! + 1);
          this.treeService.clearPaginationCache();
        }),
      )
      .subscribe();
  }

  private getFarmIdAndAreaId() {
    const params$ = [
      this.route.parent!.parent!.params.pipe(
        map(({ farmId }) => {
          if (typeof farmId !== "string") throw TypeError("no farmId");
          return farmId;
        }),
      ),
      this.route.parent!.params.pipe(
        map(({ areaId }) => {
          if (typeof areaId !== "string") throw TypeError("no areaId");
          return areaId;
        }),
      ),
    ].map((param$) => param$.pipe(first()));
    return forkJoin(params$);
  }
}
