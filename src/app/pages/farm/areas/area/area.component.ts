import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { first, forkJoin, map, mergeMap, Observable } from "rxjs";
import { Area } from "src/app/farm/area.model";
import { AreaService } from "src/app/farm/area.service";
import { CoffeeTree } from "src/app/farm/tree.model";

@Component({
  selector: "app-area",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.css"],
})
export class AreaComponent implements OnInit {
  public area = new Observable<Area>();
  constructor(private route: ActivatedRoute, private areaService: AreaService) {}

  ngOnInit(): void {
    const params$ = [
      this.route.parent!.params.pipe(
        map(({ farmId }) => {
          if (typeof farmId !== "string") throw TypeError("no farmId");
          return farmId;
        }),
      ),
      this.route.params.pipe(
        map(({ areaId }) => {
          if (typeof areaId !== "string") throw TypeError("no areaId");
          return areaId;
        }),
      ),
    ].map((param$) => param$.pipe(first()));
    this.area = forkJoin(params$).pipe(mergeMap(([farmId, areaId]) => this.areaService.watchArea(farmId, areaId)));
  }
}
