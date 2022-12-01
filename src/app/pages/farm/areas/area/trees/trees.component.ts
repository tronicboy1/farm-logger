import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first, forkJoin, map, Observable, switchMap } from "rxjs";
import { CoffeeTreeWithId } from "src/app/farm/tree.model";
import { TreeService } from "src/app/farm/tree.service";

@Component({
  selector: "app-trees",
  templateUrl: "./trees.component.html",
  styleUrls: ["./trees.component.css"],
})
export class TreesComponent implements OnInit {
  public trees = new Observable<CoffeeTreeWithId[]>();
  constructor(private route: ActivatedRoute, private treeService: TreeService, private router: Router) {}

  ngOnInit(): void {
    this.trees = this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId]) => this.treeService.watchTrees(farmId, areaId)),
    );
  }

  public handleTreeClick(treeId: string) {
    this.router.navigate([treeId], { relativeTo: this.route });
  }

  public getLastReport(treeId: string) {
    return this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId]) => this.treeService.getLatestReport(farmId, areaId, treeId)),
    );
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
