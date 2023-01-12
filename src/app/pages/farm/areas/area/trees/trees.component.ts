import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, first, forkJoin, map, sampleTime, Subscription, switchMap } from 'rxjs';
import { TreeReportService } from 'src/app/farm/tree-report.service';
import { AreaRouteParamsComponent } from '../route-params.inheritable';

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreesComponent extends AreaRouteParamsComponent implements OnInit, OnDestroy {
  readonly trees$ = this.getFarmIdAndAreaId().pipe(
    switchMap(([farmId, areaId]) =>
      this.treeService.watchTrees(farmId, areaId).pipe(
        switchMap((trees) =>
          forkJoin(
            trees.map((tree) =>
              forkJoin([
                this.treeReportService.getLatestReport(farmId, areaId, tree.id),
                this.treeReportService.getLatestIndividualFertilization(farmId, areaId, tree.id),
              ]).pipe(
                map(([report, latestIndividualFertilization]) => ({
                  latestIndividualFertilization,
                  report,
                  ...tree,
                })),
              ),
            ),
          ),
        ),
      ),
    ),
  );
  private showAddModalSubject = new BehaviorSubject(false);
  readonly loading$ = this.treeService.treesLoading$;
  public showAddModal = this.showAddModalSubject.asObservable();
  public searchControl = new FormControl('');
  private subscriptions = new Subscription();

  constructor(private treeReportService: TreeReportService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(sampleTime(200)).subscribe((search) => {
        this.treeService.setSearch(search ?? '');
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.treeService.setSearch('');
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  public handleTreeClick(treeId: string) {
    this.router.navigate([treeId], { relativeTo: this.route });
  }
  public loadNextPage() {
    this.trees$.pipe(first()).subscribe((trees) => {
      if (!trees.length) return;
      this.treeService.triggerNextPage();
    });
  }
}
