import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaService } from '@farm/area.service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-delete-area-modal',
  templateUrl: './delete-area-modal.component.html',
  styleUrls: ['./delete-area-modal.component.css'],
})
export class DeleteAreaModalComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private areaService = inject(AreaService);
  public areas$ = this.route.parent!.params.pipe(
    map((params) => params['farmId'] as string),
    switchMap((farmId) => this.areaService.watchAreas(farmId)),
  );

  handleModalClose() {
    this.router.navigate([{ outlets: { modals: null } }], {
      relativeTo: this.route.parent,
      queryParamsHandling: 'preserve',
    });
  }
}
