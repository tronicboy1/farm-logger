import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, map, mergeMap } from 'rxjs';
import { LogService } from 'src/app/log/log.service';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogViewComponent {
  private farmId$ = this.route.params.pipe(
    map((params) => {
      const { farmId } = params;
      if (typeof farmId !== 'string') throw Error('Farm id not found');
      return farmId;
    }),
  );
  readonly logs$ = this.farmId$.pipe(
    first(),
    mergeMap((farmId) => this.logService.getLogs(farmId)),
  );

  constructor(private logService: LogService, private route: ActivatedRoute) {}
}
