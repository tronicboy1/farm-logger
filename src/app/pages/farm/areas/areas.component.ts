import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, map, switchMap } from 'rxjs';
import { AreaService } from 'src/app/farm/area.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreasComponent {
  private route = inject(ActivatedRoute);
  private areaService = inject(AreaService);
  readonly areas = this.route.parent!.params.pipe(
    first(),
    map((params) => params['farmId'] as string),
    switchMap((farmId) => this.areaService.watchAreas(farmId)),
  );
}
