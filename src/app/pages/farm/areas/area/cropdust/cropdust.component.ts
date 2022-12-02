import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, first, forkJoin, map, mergeMap, Observable, switchMap } from "rxjs";
import { CropdustService, CropdustWithId } from "src/app/farm/cropdust.service";

@Component({
  selector: "app-cropdust",
  templateUrl: "./cropdust.component.html",
  styleUrls: ["./cropdust.component.css"],
})
export class CropdustComponent implements OnInit {
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();
  public cropdusts = new Observable<CropdustWithId[]>();

  constructor(private route: ActivatedRoute, private cropdustService: CropdustService) {}

  ngOnInit(): void {
    this.cropdusts = this.getFarmIdAndAreaId().pipe(
      switchMap(([farmId, areaId]) => this.cropdustService.watchCropdusts(farmId, areaId)),
    );
  }

  public toggleAddModal = (force?: boolean) => this.showAddModalSubject.next(force ?? !this.showAddModalSubject.value);

  public removeFertilization(id: string) {
    this.getFarmIdAndAreaId()
      .pipe(mergeMap(([farmId, areaId]) => this.cropdustService.removeCropdust(farmId, areaId, id)))
      .subscribe();
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
