import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FarmService } from '@farm/farm.service';

@Component({
  selector: 'app-new-farm-modal',
  templateUrl: './new-farm-modal.component.html',
  styleUrls: ['./new-farm-modal.component.css'],
})
export class NewFarmModalComponent {
  private farmService = inject(FarmService);
  private router = inject(Router);

  public closeAddModal(refresh?: boolean) {
    if (refresh) this.farmService.refreshFarms();
    this.router.navigate(['../', 'home']);
  }
}
