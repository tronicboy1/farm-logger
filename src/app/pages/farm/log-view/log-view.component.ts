import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buffer, combineLatest, debounceTime, first, map, mergeMap, Subject, Subscription } from 'rxjs';
import { LogService } from 'src/app/log/log.service';

@Component({
  selector: 'app-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogViewComponent implements OnInit, OnDestroy {
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
  private intersections$ = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(private logService: LogService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([this.intersections$.pipe(buffer(this.intersections$.pipe(debounceTime(250)))), this.farmId$])
        .pipe(mergeMap(([ids, farmId]) => this.logService.setLogsAsViewed(farmId, ids)))
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe;
  }

  handleIntersection(id: string) {
    this.intersections$.next(id);
  }
}
