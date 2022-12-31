import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserData, UserService } from 'ngx-firebase-user-platform';
import { finalize, first, forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { FarmService } from 'src/app/farm/farm.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() adminMembers: string[] = [];
  @Input() observerMembers: string[] = [];
  adminMembersWithDetails: UserData[] = [];
  observerMembersWithDetails: UserData[] = [];
  uidToDelete?: string;
  showMembers = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private farmService: FarmService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.adminMembersWithDetails = [];
    this.observerMembersWithDetails = [];
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

  public toggleMembers = (force?: boolean) => (this.showMembers = force ?? !this.showMembers);
  public handleMemberDeleteClick = (uid: string) => (this.uidToDelete = uid);
  public handleModalClose = () => (this.uidToDelete = undefined);
  public confirmDelete() {
    if (!this.uidToDelete) throw Error();
    this.deleteUidFromFarm(this.uidToDelete);
  }

  private deleteUidFromFarm(uidToDelete: string) {
    let uidCache: string;
    let farmIdCache: string;
    this.authService
      .getUid()
      .pipe(
        first(),
        switchMap((uid) => {
          uidCache = uid;
          return this.route.parent!.params.pipe(first());
        }),
        switchMap((params) => {
          const { farmId } = params;
          if (typeof farmId !== 'string') throw Error('no farmId');
          farmIdCache = farmId;
          return this.farmService.getFarm(farmId);
        }),
        switchMap((farm) => {
          if (farm.owner === uidToDelete) throw Error('Cannot delete owner from farm admin members');
          const filterCallback = (uid: string) => uid !== uidToDelete;
          return this.farmService.updateFarm(farmIdCache, {
            adminMembers: farm.adminMembers.filter(filterCallback),
            observerMembers: farm.observerMembers.filter(filterCallback),
          });
        }),
        tap(() => {
          if (uidToDelete === uidCache) this.router.navigateByUrl('/home');
        }),
        finalize(() => (this.uidToDelete = undefined)),
      )
      .subscribe();
  }

  public handleAdminMemberSubmit() {}

  public handleObserverMemberSubmit() {}
}
