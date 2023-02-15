import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PlantReportServiceImplementation } from '@farm/plants/plant-report.service';
import { Plant, PlantReport, PlantTypes, PlantWithId } from '@farm/plants/plant.model';
import { PlantServiceImplementation } from '@farm/plants/plant.service';
import {
  BehaviorSubject,
  forkJoin,
  map,
  OperatorFunction,
  sampleTime,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import { AreaRouteParamsComponent } from '../route-params.inheritable';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantsComponent extends AreaRouteParamsComponent implements OnInit, OnDestroy {
  protected plantReportService = inject(PlantReportServiceImplementation);
  private router = inject(Router);
  protected plantService = inject(PlantServiceImplementation);
  readonly plants$ = this.getFarmIdAndAreaId().pipe(
    switchMap(([farmId, areaId]) =>
      this.plantService.watchAll(this, farmId, areaId).pipe(
        switchMap((plants) =>
          forkJoin(
            plants.map((plant) =>
              forkJoin([
                this.plantReportService.getLatestReport(farmId, areaId, plant.id),
                this.plantReportService.getLatestIndividualFertilization(farmId, areaId, plant.id),
              ]).pipe(
                map(([report, latestIndividualFertilization]) => ({
                  latestIndividualFertilization,
                  report,
                  ...plant,
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
  public showAddModal = this.showAddModalSubject.asObservable();
  public searchControl = new FormControl('');
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(sampleTime(200)).subscribe((search) => {
        this.plantService.setSearch(this, search ?? '');
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);
  public handlePlantClick(plantId: string) {
    this.router.navigate([plantId], { relativeTo: this.route });
  }
  public loadNextPage() {
    this.plantService.triggerNextPage(this);
  }

  refreshPlants() {
    this.plantService.clearPaginationCache(this);
  }
}
