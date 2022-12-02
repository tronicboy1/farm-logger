import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, first, forkJoin, map, mergeMap, Observable, switchMap, tap } from "rxjs";
import { FertilizationService, FertilizationWithId } from "src/app/farm/fertilization.service";

@Component({
  selector: "app-fertilizer",
  templateUrl: "./fertilizer.component.html",
  styleUrls: ["./fertilizer.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FertilizerComponent implements OnInit {
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();
  public fertilizations = new Observable<FertilizationWithId[]>();

  constructor(private route: ActivatedRoute, private fertilizationService: FertilizationService) {}

  ngOnInit(): void {
    this.fertilizations = this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId]) => this.fertilizationService.watchFertilizations(farmId, areaId)),
    );
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);

  public removeFertilization(id: string) {
    this.getFarmIdAndAreaId().pipe(
      mergeMap(([farmId, areaId]) => this.fertilizationService.removeFertilization(farmId, areaId, id)),
    ).subscribe();
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
