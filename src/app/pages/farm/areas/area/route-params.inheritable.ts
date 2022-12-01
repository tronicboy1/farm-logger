import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { first, forkJoin, map } from "rxjs";
import { TreeService } from "src/app/farm/tree.service";

@Component({
  template: "",
})
export class RouteParamsComponent {
  public newTreeFromGroup = new FormGroup({
    regularId: new FormControl(),
  });
  constructor(protected route: ActivatedRoute, protected treeService: TreeService) {}

  protected getFarmIdAndAreaId() {
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
