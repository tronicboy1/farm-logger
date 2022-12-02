import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "../location.component";

@Component({
  selector: "app-location-form",
  templateUrl: "./location-form.component.html",
  styleUrls: ["./location-form.component.css", "../../../../styles/basic-form.css"],
})
export class LocationFormComponent implements OnInit {
  locationFormGroup = new FormGroup({
    latitude: new FormControl(0, [Validators.required, Validators.max(90), Validators.min(-90)]),
    longitude: new FormControl(0, [Validators.required, Validators.max(180), Validators.min(-180)]),
    altitude: new FormControl<number | null>(null),
  });
  @Output() submitted = new EventEmitter<Location>();

  constructor() {}

  handleSubmit() {
    const latitude = this.locationFormGroup.controls.latitude.value!;
    const longitude = this.locationFormGroup.controls.longitude.value!;
    const altitude = this.locationFormGroup.controls.altitude.value;
    this.submitted.emit([latitude, longitude, altitude]);
  }

  ngOnInit(): void {}
}
