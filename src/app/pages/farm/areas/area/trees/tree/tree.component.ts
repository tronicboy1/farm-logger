import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, first, forkJoin, map, mergeMap, Observable, switchMap } from 'rxjs';
import { TreeReportService } from 'src/app/farm/tree-report.service';
import { CoffeeTree, CoffeeTreeReportWithId } from 'src/app/farm/tree.model';
import { TreeService } from 'src/app/farm/tree.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  public tree = new Observable<CoffeeTree>();
  public reports = new Observable<CoffeeTreeReportWithId[]>();
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();
  private showPictureModalSubject = new BehaviorSubject<string | undefined>(undefined);
  readonly showPictureModal$ = this.showPictureModalSubject.asObservable();
  private reportToDeleteSubject = new BehaviorSubject<string | undefined>(undefined);
  readonly reportToDelete$ = this.reportToDeleteSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private treeService: TreeService,
    private treeReportService: TreeReportService,
  ) {}

  ngOnInit(): void {
    this.tree = this.getFarmIdAreaIdAndTreeId().pipe(
      switchMap(([farmId, areaId, treeId]) => this.treeService.watchTree(farmId, areaId, treeId)),
    );
    this.reports = this.getFarmIdAreaIdAndTreeId().pipe(
      switchMap(([farmId, areaId, treeId]) => this.treeReportService.watchReports(farmId, areaId, treeId)),
    );
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  public togglePictureModal = (photoURL: string | undefined) => this.showPictureModalSubject.next(photoURL);

  public setReportToDelete(id: string | undefined) {
    this.reportToDeleteSubject.next(id);
  }
  public removeReport() {
    this.reportToDeleteSubject.next(undefined);
    const id = this.reportToDeleteSubject.value
    if (!id) return;
    this.getFarmIdAreaIdAndTreeId()
      .pipe(mergeMap(([farmId, areaId, treeId]) => this.treeReportService.removeReport(farmId, areaId, treeId, id)))
      .subscribe();
  }

  private getFarmIdAreaIdAndTreeId() {
    const params$ = [
      this.route.parent!.parent!.params.pipe(
        first(),
        map(({ farmId }) => {
          if (typeof farmId !== 'string') throw TypeError('no farmId');
          return farmId;
        }),
      ),
      this.route.parent!.params.pipe(
        first(),
        map(({ areaId }) => {
          if (typeof areaId !== 'string') throw TypeError('no areaId');
          return areaId;
        }),
      ),
      this.route.params.pipe(
        first(),
        map(({ treeId }) => {
          if (typeof treeId !== 'string') throw TypeError('no treeId');
          return treeId;
        }),
      ),
    ] as const;
    return forkJoin(params$);
  }
}
