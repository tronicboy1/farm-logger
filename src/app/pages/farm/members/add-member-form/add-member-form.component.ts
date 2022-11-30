import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "@user/auth.service";
import { EmailExistsValidator } from "@user/email-exists.validator";
import { UserService } from "@user/user.service";
import { first, forkJoin, map, mergeMap, of, Subscription, tap } from "rxjs";
import { FarmService } from "src/app/farm/farm.service";

enum RoleEnum {
  Admin,
  Observer,
}

@Component({
  selector: "app-add-member-form",
  templateUrl: "./add-member-form.component.html",
  styleUrls: ["./add-member-form.component.css", "../../../../../styles/basic-form.css"],
})
export class AddMemberFormComponent implements OnInit {
  roles: { value: RoleEnum; title: string }[] = [
    { value: RoleEnum.Admin, title: "作業員" },
    { value: RoleEnum.Observer, title: "観察者" },
  ];
  formGroup = new FormGroup({
    email: new FormControl(
      "",
      [Validators.email, Validators.required],
      [this.emailExistsValidator.validate.bind(this.emailExistsValidator)],
    ),
    role: new FormControl(0, [Validators.required]),
  });
  emailDoesNotExist = false;
  submitError = false;

  private subscription = new Subscription();

  constructor(
    private emailExistsValidator: EmailExistsValidator,
    private farmService: FarmService,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.formGroup.controls.email.statusChanges.subscribe((status) => {
        this.emailDoesNotExist = false;
        if (status === "PENDING" || status === "VALID") return;
        const { errors } = this.formGroup.controls.email;
        if (errors && errors["userDoesNotExist"]) {
          this.emailDoesNotExist = true;
        }
      }),
    );
  }

  public handleSubmit() {
    if (this.formGroup.invalid) return;
    const email = this.formGroup.controls.email.value!.trim();
    const role = this.formGroup.controls.role.value!;
    this.submitError = false;
    this.route.params
      .pipe(
        first(),
        map((params) => {
          const { farmId } = params;
          if (typeof farmId !== "string") throw TypeError();
          return farmId;
        }),
        mergeMap((farmId) =>
          forkJoin([
            this.userService.getTheirUid(email),
            this.authService.getUid().pipe(first()),
            this.farmService.getFarm(farmId),
            of(farmId),
          ]),
        ),
        mergeMap(([theirUid, myUid, farm, farmId]) => {
          if (theirUid === myUid) throw Error("Cannot add self.");
          if (farm.adminMembers.includes(theirUid) || farm.observerMembers.includes(theirUid))
            throw Error("User already a member");
          return this.farmService.addMembers(farmId, [theirUid], Boolean(role));
        }),
        tap(() => this.formGroup.reset()),
      )
      .subscribe({
        error: () => {
          this.submitError = true;
        },
      });
  }
}
