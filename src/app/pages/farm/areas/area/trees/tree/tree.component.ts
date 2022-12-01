import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, first, forkJoin, map, Observable, switchMap, tap } from "rxjs";
import { CoffeeTree, CoffeeTreeReport } from "src/app/farm/tree.model";
import { TreeService } from "src/app/farm/tree.service";

@Component({
  selector: "app-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  public tree = new Observable<CoffeeTree>();
  public reports = new Observable<CoffeeTreeReport[]>();
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();

  constructor(private route: ActivatedRoute, private treeService: TreeService) {}

  ngOnInit(): void {
    this.tree = this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId, treeId]) => this.treeService.watchTree(farmId, areaId, treeId)),
    );
    this.reports = this.tree.pipe(map((tree) => Object.values(tree.reports ?? {})));
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);

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
      this.route.params.pipe(
        first(),
        map(({ treeId }) => {
          if (typeof treeId !== "string") throw TypeError("no treeId");
          return treeId;
        }),
      ),
    ] as const;
    return forkJoin(params$);
  }
}
