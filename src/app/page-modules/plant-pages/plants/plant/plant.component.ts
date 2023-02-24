import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlantReportServiceImplementation } from '@farm/plants/plant-report.service';
import { PlantServiceImplementation } from '@farm/plants/plant.service';
import { BehaviorSubject, first, mergeMap, Observable, shareReplay, switchMap } from 'rxjs';
import { PlantIdInheritable } from './plant-id.inhertible';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantComponent extends PlantIdInheritable {
  protected plantService = inject(PlantServiceImplementation);
  protected plantReportService = inject(PlantReportServiceImplementation);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this.loadingSubject.asObservable();
  readonly plant = this.getFarmIdAreaIdAndPlantId().pipe(
    switchMap(([farmId, areaId, plantId]) => this.plantService.watchOne(farmId, areaId, plantId)),
  );
  reports = this.getFarmIdAreaIdAndPlantId().pipe(
    switchMap(([farmId, areaId, plantId]) => this.plantReportService.watchAll(this, farmId, areaId, plantId)),
    shareReplay(1),
  );
  private showPictureModalSubject = new BehaviorSubject<string | undefined>(undefined);
  readonly showPictureModal$ = this.showPictureModalSubject.asObservable();
  readonly showEditModal$ = new BehaviorSubject(false);
  private reportToDeleteSubject = new BehaviorSubject<string | undefined>(undefined);
  readonly reportToDelete$ = this.reportToDeleteSubject.asObservable();
  readonly addingReport$: Observable<boolean>;

  constructor() {
    super();
    this.addingReport$ = this.plantReportService.addingReport$;
  }
  public toggleEditModal = (force?: boolean) => this.showEditModal$.next(force ?? !this.showEditModal$.value);
  public togglePictureModal = (photoURL: string | undefined) => this.showPictureModalSubject.next(photoURL);

  handleEndOfPage() {
    this.reports.pipe(first()).subscribe((reports) => {
      if (!reports.length) return;
      this.plantReportService.triggerNextPage(this);
    });
  }

  public setReportToDelete(id: string | undefined) {
    this.reportToDeleteSubject.next(id);
  }
  public removeReport() {
    const id = this.reportToDeleteSubject.getValue();
    if (!id) return;
    this.reportToDeleteSubject.next(undefined);
    this.getFarmIdAreaIdAndPlantId()
      .pipe(mergeMap(([farmId, areaId, plantId]) => this.plantReportService.removeReport(farmId, areaId, plantId, id)))
      .subscribe({ complete: () => this.plantReportService.clearPaginationCache(this) });
  }
}
