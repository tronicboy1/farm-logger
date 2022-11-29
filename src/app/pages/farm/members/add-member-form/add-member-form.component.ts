import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EmailExistsValidator } from "@user/email-exists.validator";
import { Subscription } from "rxjs";

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

  private subscription = new Subscription();

  constructor(private emailExistsValidator: EmailExistsValidator) {}

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
}
