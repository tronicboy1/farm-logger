import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-area-modal',
  templateUrl: './new-area-modal.component.html',
  styleUrls: ['./new-area-modal.component.css'],
})
export class NewAreaModalComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  handleModalClose() {
    this.router.navigate([{ outlets: { modals: null } }], {
      relativeTo: this.route.parent?.parent,
      queryParamsHandling: 'preserve',
    });
  }
}
