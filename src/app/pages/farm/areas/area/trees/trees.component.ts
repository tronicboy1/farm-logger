import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TreeReportService } from '@farm/plants/coffee-tree/tree-report.service';
import { BehaviorSubject, forkJoin, map, sampleTime, shareReplay, Subscription, switchMap, withLatestFrom } from 'rxjs';
import { AreaRouteParamsComponent } from '../route-params.inheritable';

@Component({
  selector: 'app-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreesComponent extends AreaRouteParamsComponent implements OnInit, OnDestroy {
  private treeReportService = inject(TreeReportService);
  private router = inject(Router);
  readonly trees$ = this.getFarmIdAndAreaId().pipe(
    switchMap(([farmId, areaId]) =>
      this.treeService.watchAll(this, farmId, areaId).pipe(
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
    shareReplay(1),
  );
  private showAddModalSubject = new BehaviorSubject(false);
  readonly loading$ = this.treeService.treesLoading$;
  public showAddModal = this.showAddModalSubject.asObservable();
  public searchControl = new FormControl('');
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(sampleTime(200)).subscribe((search) => {
        this.treeService.setSearch(this, search ?? '');
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  public handleTreeClick(treeId: string) {
    this.router.navigate([treeId], { relativeTo: this.route });
  }
  public loadNextPage() {
    this.treeService.triggerNextPage(this);
  }

  refreshTrees() {
    this.treeService.clearPaginationCache(this);
  }
}
