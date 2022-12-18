import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, first, map, Observable, switchMap } from 'rxjs';
import { Farm } from 'src/app/farm/farm.model';
import { FarmService } from 'src/app/farm/farm.service';
import { LogActions } from 'src/app/log/log.model';
import { LogService } from 'src/app/log/log.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.css'],
})
export class FarmComponent implements OnInit {
  private farmId$ = this.route.params.pipe(
    map((params) => {
      const { farmId } = params;
      if (typeof farmId !== 'string') throw TypeError('Farm ID was not in params.');
      return farmId;
    }),
  );
  public farm = this.farmId$.pipe(
    switchMap((farmId) => {
      return this.farmService.watchFarm(farmId);
    }),
  );
  readonly showLogs$ = this.route.queryParams.pipe(map((queryParams) => Boolean(queryParams['show-logs'])));

  constructor(private route: ActivatedRoute, private farmService: FarmService, private logService: LogService) {}

  ngOnInit(): void {
    this.farmId$
      .pipe(
        first(),
        switchMap((farmId) => this.logService.addLog(farmId, LogActions.ViewFarm)),
      )
      .subscribe();
  }
}
