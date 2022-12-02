import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@user/auth.service";
import { finalize, mergeMap, take, tap } from "rxjs";
import { FarmService } from "src/app/farm/farm.service";

@Component({
  selector: "app-new-farm-form",
  templateUrl: "./new-farm-form.component.html",
  styleUrls: ["./new-farm-form.component.css", "../../../../styles/basic-form.css"],
})
export class NewFarmFormComponent implements OnInit {
  public newFarmForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.maxLength(64), Validators.minLength(1)]),
  });
  public loading = false;
  @Output() submitted = new EventEmitter<void>()

  constructor(private authService: AuthService, private farmService: FarmService) {}

  ngOnInit(): void {}

  public handleFarmSubmit() {
    if (this.newFarmForm.invalid) return;
    const name = this.newFarmForm.controls.name.value!.trim();
    this.loading = true;
    this.authService
      .getUid()
      .pipe(
        take(1),
        mergeMap((uid) =>
          this.farmService.createFarm({
            name,
            adminMembers: [uid],
            owner: uid,
            observerMembers: [],
            createdAt: Date.now(),
          }),
        ),
        tap(() => {
          this.newFarmForm.reset();
          this.farmService.refreshFarms();
          this.submitted.emit();
        }),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe();
  }
}
