import { Injectable } from '@angular/core';
import { FarmModule } from './farm.module';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  CollectionReference,
  DocumentReference,
  deleteDoc,
} from 'firebase/firestore';
import {
  defaultIfEmpty,
  first,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Farm, FarmWithId } from './farm.model';
import { Firebase } from '@custom-firebase/index';
import { AuthService } from 'ngx-firebase-user-platform';
import { AreaService } from './area.service';
import { TreeService } from './plants/tree.service';
import { PhotoService } from './util/photo.service';
import { TreeReportService } from './plants/tree-report.service';

@Injectable({
  providedIn: FarmModule,
})
export class FarmService {
  private loadSubject = new ReplaySubject<void>();
  private cachedFarmId?: string;
  private cachedFarm$?: Observable<Farm>;

  constructor(
    private authService: AuthService,
    private areaService: AreaService,
    private treeService: TreeService,
    private treeReportService: TreeReportService,
    private photoService: PhotoService,
  ) {
    this.loadSubject.next();
  }

  public getFarm(id: string) {
    if (this.cachedFarmId !== id) this.cachedFarm$ = undefined;
    return (this.cachedFarm$ ||= from(
      getDoc(this.getRef(id)).then((result) => {
        if (!result) throw Error('Tree not found.');
        return result.data() as Farm;
      }),
    ).pipe(shareReplay(1)));
  }

  public watchFarm(id: string): Observable<Farm> {
    return new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      return onSnapshot(this.getRef(id), (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (!result.exists) throw Error('Farm does not exist');
        return result.data() as Farm;
      }),
      switchMap((farm) => this.checkIfUserIsMember(farm)),
    );
  }

  private checkIfUserIsMember(farm: Farm): Observable<Farm> {
    return this.authService.getUid().pipe(
      first(),
      map((uid) => {
        if (!(farm.adminMembers.includes(uid) || farm.observerMembers.includes(uid))) throw Error('Not authorized.');
        return farm;
      }),
    );
  }

  private checkIfUserIsAdminMember(farm: Farm): Observable<Farm> {
    return this.authService.getUid().pipe(
      first(),
      map((uid) => {
        if (!farm.adminMembers.includes(uid)) throw Error('Not authorized.');
        return farm;
      }),
    );
  }

  /** Loads farms of Current User and return observable. */
  public loadMyFarms(): Observable<FarmWithId[]> {
    return this.loadSubject.pipe(
      switchMap(() => this.authService.getUid()),
      switchMap((uid) => forkJoin([this.getAdminFarms(uid), this.getObservedFarms(uid)])),
      map(([adminFarms, observerFarms]) => [...adminFarms, ...observerFarms]),
    );
  }
  /** Refreshes all subscribed farm loaders. */
  public refreshFarms(): void {
    this.loadSubject.next();
  }

  private getAdminFarms(uid: string): Observable<FarmWithId[]> {
    const q = query(this.getRef(), where('adminMembers', 'array-contains', uid));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => ({ ...(doc.data() as Farm), id: doc.id }));
      }),
    );
  }

  private getObservedFarms(uid: string): Observable<FarmWithId[]> {
    const q = query(this.getRef(), where('observerMembers', 'array-contains', uid));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => ({ ...(doc.data() as Farm), id: doc.id }));
      }),
    );
  }

  public createFarm(farmData: Omit<Farm, 'areas' | 'environmentRecords'>) {
    return addDoc(this.getRef(), farmData);
  }

  public updateFarm(id: string, farmData: Partial<Farm>) {
    return updateDoc(this.getRef(id), farmData);
  }

  public addMembers(farmId: string, newMemberUids: string | string[], observer = false) {
    const newMembersUidArray = Array.isArray(newMemberUids) ? newMemberUids : [newMemberUids];
    return from(this.getFarm(farmId)).pipe(
      map((farm) => (observer ? farm.observerMembers : farm.adminMembers)),
      mergeMap((memberUids) => {
        const mergedUids = [...memberUids, ...newMembersUidArray];
        return this.updateFarm(farmId, observer ? { observerMembers: mergedUids } : { adminMembers: mergedUids });
      }),
    );
  }

  /**
   * Deletes farm along with all photos in Storage.
   */
  public deleteFarm(farmId: string) {
    return this.areaService.watchAreas(farmId).pipe(
      first(),
      map((areas) => areas.map((area) => area.id)),
      mergeMap((areaIds) =>
        forkJoin(
          areaIds.map((areaId) =>
            this.treeService.watchTrees(farmId, areaId).pipe(
              first(),
              map((trees) => trees.map((tree) => ({ treeId: tree.id, areaId }))),
            ),
          ),
        ).pipe(defaultIfEmpty([])),
      ),
      map((trees) => trees.flat()),
      mergeMap((trees) =>
        forkJoin(trees.map((tree) => this.treeReportService.getAllReports(farmId, tree.areaId, tree.treeId))).pipe(
          defaultIfEmpty([]),
        ),
      ),
      map((reports) => reports.flat().filter((report) => Boolean(report.photoPath))),
      mergeMap((reports) =>
        forkJoin(reports.map((report) => this.photoService.deletePhoto(report.photoPath))).pipe(defaultIfEmpty([])),
      ),
      mergeMap(() => deleteDoc(this.getRef(farmId))),
    );
  }

  private getRef(): CollectionReference<DocumentData>;
  private getRef(id: string): DocumentReference<DocumentData>;
  private getRef(id?: string) {
    return id ? doc(Firebase.firestore, `farms/${id}`) : collection(Firebase.firestore, 'farms');
  }
}
