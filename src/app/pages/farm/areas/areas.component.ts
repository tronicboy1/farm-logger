import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, first, map, switchMap } from 'rxjs';
import { AreaService } from 'src/app/farm/area.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreasComponent {
  public areas = this.route.parent!.params.pipe(
    first(),
    map((params) => {
      const { farmId } = params;
      if (typeof farmId !== 'string') throw TypeError();
      return farmId;
    }),
    switchMap((farmId) => this.areaService.watchAreas(farmId)),
  );
  private showNewAreaForm = new BehaviorSubject(false);
  readonly showNewAreaForm$ = this.showNewAreaForm.asObservable();
  private showDeleteAreaForm = new BehaviorSubject(false);
  readonly showDeleteAreaForm$ = this.showDeleteAreaForm.asObservable();

  constructor(private route: ActivatedRoute, private areaService: AreaService, private router: Router) {}

  toggleNewAreaForm = (force?: boolean) => this.showNewAreaForm.next(force ?? !this.showNewAreaForm.value);
  toggleDeleteAreaForm = (force?: boolean) => this.showDeleteAreaForm.next(force ?? !this.showDeleteAreaForm.value);
  handleAreaClick(areaId: string) {
    this.router.navigate([areaId], { relativeTo: this.route });
  }
}
