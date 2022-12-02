import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, switchMap } from "rxjs";
import { Farm } from "src/app/farm/farm.model";
import { FarmService } from "src/app/farm/farm.service";

@Component({
  selector: "app-farm",
  templateUrl: "./farm.component.html",
  styleUrls: ["./farm.component.css"],
})
export class FarmComponent implements OnInit {
  public farm = new Observable<Farm>();

  constructor(private route: ActivatedRoute, private farmService: FarmService) {}

  ngOnInit(): void {
    this.farm = this.route.params.pipe(
      switchMap((params) => {
        const { farmId } = params;
        if (typeof farmId !== "string") throw TypeError("Farm ID was not in params.");
        return this.farmService.watchFarm(farmId);
      }),
    );
  }
}
