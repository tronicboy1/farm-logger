import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, switchMap } from 'rxjs';
import { CropdustService, CropdustWithId } from 'src/app/farm/cropdust.service';
import { AreaRouteParamsComponent } from '../route-params.inheritable';

@Component({
  selector: 'app-cropdust',
  templateUrl: './cropdust.component.html',
  styleUrls: ['./cropdust.component.css'],
})
export class CropdustComponent extends AreaRouteParamsComponent implements OnInit {
  private showAddModalSubject = new BehaviorSubject(false);
  public showAddModal = this.showAddModalSubject.asObservable();
  public cropdusts = new Observable<CropdustWithId[]>();

  constructor(private cropdustService: CropdustService) {
    super();
  }

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
}
