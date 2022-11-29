import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { UserData, UserService } from "@user/user.service";
import { combineLatest, first, forkJoin, Subscription } from "rxjs";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.css"],
})
export class MembersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() adminMembers: string[] = [];
  @Input() observerMembers: string[] = [];
  adminMembersWithDetails: UserData[] = [];
  observerMembersWithDetails: UserData[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    console.log("change")
    this.subscriptions.push(
      forkJoin(this.adminMembers.map((uid) => this.userService.watchUserDoc(uid).pipe(first()))).subscribe(
        (details) => {
          this.adminMembersWithDetails = details;
        },
      ),
      forkJoin(this.observerMembers.map((uid) => this.userService.watchUserDoc(uid).pipe(first()))).subscribe(
        (details) => {
          this.observerMembersWithDetails = details;
        },
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  public handleAdminMemberSubmit() {}

  public handleObserverMemberSubmit() {}
}
