import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, filter, first, forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { TreeReportService } from "src/app/farm/tree-report.service";
import { CoffeeTreeReport, CoffeeTreeWithId } from "src/app/farm/tree.model";
import { TreeService } from "src/app/farm/tree.service";

@Component({
  selector: "app-trees",
  templateUrl: "./trees.component.html",
  styleUrls: ["./trees.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreesComponent implements OnInit {
  public trees = new Observable<(CoffeeTreeWithId & { report: CoffeeTreeReport | null })[]>();
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();
  public searchControl = new FormControl("");

  constructor(
    private route: ActivatedRoute,
    private treeService: TreeService,
    private treeReportService: TreeReportService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.trees = this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId]) =>
        this.treeService
          .watchTrees(farmId, areaId)
          .pipe(
            switchMap((trees) =>
              forkJoin(
                trees.map((tree) =>
                  this.treeReportService
                    .getLatestReport(farmId, areaId, tree.id)
                    .pipe(map((report) => ({ report, ...tree }))),
                ),
              ),
            ),
          ),
      ),
    );
    this.searchControl.valueChanges.subscribe((search) => {
      console.log(search);
      this.treeService.setSearch(search ?? "");
    })
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  public handleTreeClick(treeId: string) {
    this.router.navigate([treeId], { relativeTo: this.route });
  }

  public getLastReport(treeId: string) {
    return this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId]) => this.treeReportService.getLatestReport(farmId, areaId, treeId)),
      first(),
    );
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
