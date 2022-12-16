import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, Observable, switchMap } from 'rxjs';
import { AreaWithId } from 'src/app/farm/area.model';
import { AreaService } from 'src/app/farm/area.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css'],
})
export class AreasComponent implements OnInit {
  public areas = new Observable<AreaWithId[]>();
  public showNewAreaForm = false;

  constructor(private route: ActivatedRoute, private areaService: AreaService, private router: Router) {}

  ngOnInit(): void {
    this.areas = this.route.parent!.params.pipe(
      first(),
      map((params) => {
        const { farmId } = params;
        if (typeof farmId !== 'string') throw TypeError();
        return farmId;
      }),
      switchMap((farmId) => this.areaService.watchAreas(farmId)),
    );
  }

  toggleNewAreaForm = (force?: boolean) => (this.showNewAreaForm = force ?? !this.showNewAreaForm);
  handleAreaClick(areaId: string) {
    this.router.navigate([areaId], { relativeTo: this.route });
  }
}
