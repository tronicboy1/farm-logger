import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TreeReportService } from '@farm/plants/coffee-tree/tree-report.service';
import { TreeService } from '@farm/plants/coffee-tree/tree.service';
import { BehaviorSubject, first, mergeMap, Observable, shareReplay, switchMap } from 'rxjs';
import { TreeIdInheritable } from './tree-id.inhertible';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent extends TreeIdInheritable {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  readonly tree = this.getFarmIdAreaIdAndTreeId().pipe(
    switchMap(([farmId, areaId, treeId]) => this.treeService.watchOne(farmId, areaId, treeId)),
  );
  readonly reports = this.getFarmIdAreaIdAndTreeId().pipe(
    switchMap(([farmId, areaId, treeId]) => this.treeReportService.watchAll(this, farmId, areaId, treeId)),
    shareReplay(1),
  );
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();
  private showPictureModalSubject = new BehaviorSubject<string | undefined>(undefined);
  readonly showPictureModal$ = this.showPictureModalSubject.asObservable();
  readonly showEditModal$ = new BehaviorSubject(false);
  private reportToDeleteSubject = new BehaviorSubject<string | undefined>(undefined);
  readonly reportToDelete$ = this.reportToDeleteSubject.asObservable();
  readonly addingReport$: Observable<boolean>;

  constructor(private treeService: TreeService, private treeReportService: TreeReportService) {
    super();
    this.addingReport$ = this.treeReportService.addingReport$;
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  public toggleEditModal = (force?: boolean) => this.showEditModal$.next(force ?? !this.showEditModal$.value);
  public togglePictureModal = (photoURL: string | undefined) => this.showPictureModalSubject.next(photoURL);
  handleNewReportSubmission() {
    this.toggleAddModal(false);
    this.treeReportService.clearPaginationCache(this);
  }
  handleEndOfPage() {
    this.reports.pipe(first()).subscribe((reports) => {
      if (!reports.length) return;
      this.treeReportService.triggerNextPage(this);
    });
  }

  public setReportToDelete(id: string | undefined) {
    this.reportToDeleteSubject.next(id);
  }
  public removeReport() {
    const id = this.reportToDeleteSubject.getValue();
    if (!id) return;
    this.reportToDeleteSubject.next(undefined);
    this.getFarmIdAreaIdAndTreeId()
      .pipe(mergeMap(([farmId, areaId, treeId]) => this.treeReportService.removeReport(farmId, areaId, treeId, id)))
      .subscribe({ complete: () => this.treeReportService.clearPaginationCache(this) });
  }
}
