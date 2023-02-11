import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, of, OperatorFunction, switchMap } from 'rxjs';
import { AreaService } from 'src/app/farm/area.service';
import { FarmService } from 'src/app/farm/farm.service';
import { TreeService } from '@farm/plants/tree.service';

@Component({
  selector: 'app-nav-location',
  templateUrl: './nav-location.component.html',
  styleUrls: ['./nav-location.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLocationComponent implements OnInit {
  private params$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd) as OperatorFunction<unknown, NavigationEnd>,
    switchMap(() =>
      combineLatest(NavLocationComponent.getChildParamsObservables(this.router.routerState.root.firstChild)),
    ),
    map((paramsArray) => {
      const paramsMap = new Map<string, string>();
      paramsArray.forEach((params) => Object.entries(params).forEach(([key, value]) => paramsMap.set(key, value)));
      return paramsMap;
    }),
  );
  private farmId$ = this.params$.pipe(map((params) => params.get('farmId')));
  readonly farmName$ = this.farmId$.pipe(
    switchMap((farmId) => (farmId ? this.farmService.getFarm(farmId).pipe(map((farm) => farm.name)) : of(''))),
  );
  private areaId$ = this.params$.pipe(map((params) => params.get('areaId')));
  readonly areaName$ = combineLatest([this.farmId$, this.areaId$]).pipe(
    switchMap(([farmId, areaId]) =>
      farmId && areaId ? this.areaService.watchArea(farmId, areaId).pipe(map((area) => area.name)) : of(''),
    ),
  );
  private treeId$ = this.params$.pipe(map((params) => params.get('treeId')));
  readonly treeRegularId$ = combineLatest([this.farmId$, this.areaId$, this.treeId$]).pipe(
    switchMap(([farmId, areaId, treeId]) =>
      farmId && areaId && treeId
        ? this.treeService.getTree(farmId, areaId, treeId).pipe(map((tree) => tree.regularId))
        : of(''),
    ),
  );

  constructor(
    private router: Router,
    private farmService: FarmService,
    private areaService: AreaService,
    private treeService: TreeService,
  ) {}

  ngOnInit(): void {}

  static getChildParamsObservables(
    route: ActivatedRoute | null,
    init: Observable<Params>[] = [],
  ): Observable<Params>[] {
    if (route) {
      const acc = [...init, route.params];
      return this.getChildParamsObservables(route.firstChild, acc);
    }
    return init;
  }
}
