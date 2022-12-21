import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, switchMap } from 'rxjs';
import { FertilizationService, FertilizationWithId } from 'src/app/farm/fertilization.service';
import { AreaRouteParamsComponent } from '../route-params.inheritable';

@Component({
  selector: 'app-fertilizer',
  templateUrl: './fertilizer.component.html',
  styleUrls: ['./fertilizer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FertilizerComponent extends AreaRouteParamsComponent implements OnInit {
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();
  public fertilizations = new Observable<FertilizationWithId[]>();

  constructor(private fertilizationService: FertilizationService) {
    super();
  }

  ngOnInit(): void {
    this.fertilizations = this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId]) => this.fertilizationService.watchFertilizations(farmId, areaId)),
    );
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);

  public removeFertilization(id: string) {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.fertilizationService.removeFertilization(farmId, areaId, id)))
      .subscribe();
  }
}
