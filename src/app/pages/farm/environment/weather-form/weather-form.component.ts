import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, first, map, mergeMap, tap } from 'rxjs';
import { EnvironmentRecordService } from 'src/app/farm/environment-record.service';

@Component({
  selector: 'app-weather-form',
  templateUrl: './weather-form.component.html',
  styleUrls: ['./weather-form.component.css', '../../../../../styles/basic-form.css'],
})
export class WeatherFormComponent implements OnInit {
  weatherFormGroup = new FormGroup({
    weather: new FormControl(''),
    high: new FormControl(25),
    low: new FormControl(20),
    windSpeed: new FormControl(1),
    humidity: new FormControl(60),
  });
  loading = new BehaviorSubject(false);
  @Output() submitted = new EventEmitter<void>();

  constructor(private route: ActivatedRoute, private environmentService: EnvironmentRecordService) {}

  ngOnInit(): void {}

  handleSubmit() {
    const weather = this.weatherFormGroup.controls.weather.value ?? '';
    const high = this.weatherFormGroup.controls.high.value ?? 0;
    const low = this.weatherFormGroup.controls.low.value ?? 0;
    const windSpeed = this.weatherFormGroup.controls.windSpeed.value ?? 0;
    const humidity = this.weatherFormGroup.controls.humidity.value ?? 0;
    this.getFarmId()
      .pipe(
        mergeMap((farmId) =>
          this.environmentService.createEnvironmentRecord(farmId, {
            weather,
            high,
            low,
            windSpeed,
            humidity,
            createdAt: Date.now(),
          }),
        ),
        tap({ next: () => this.submitted.emit() }),
      )
      .subscribe();
  }

  private getFarmId() {
    return this.route.parent!.params.pipe(
      first(),
      map((params) => {
        const { farmId } = params;
        if (typeof farmId !== 'string') throw TypeError();
        return farmId;
      }),
    );
  }
}
