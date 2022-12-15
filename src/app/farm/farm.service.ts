import { Injectable } from "@angular/core";
import { FarmModule } from "./farm.module";
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
} from "firebase/firestore";
import {
  first,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  shareReplay,
  switchMap,
} from "rxjs";
import { Farm, FarmWithId } from "./farm.model";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { app } from "@custom-firebase/firebase";
import { AuthService } from "@user/auth.service";
import { Firebase } from "@custom-firebase/index";

@Injectable({
  providedIn: FarmModule,
})
export class FarmService {
  private loadSubject = new ReplaySubject<void>();
  private cachedFarms$?: Observable<FarmWithId[]>;
  private cachedFarmId?: string;
  private cachedFarm$?: Observable<Farm>;

  constructor(private authService: AuthService) {
    this.loadSubject.next();
  }

  public getFarm(id: string) {
    if (this.cachedFarmId !== id) this.cachedFarm$ = undefined;
    const ref = doc(Firebase.firestore, `farms/${id}`);
    return (this.cachedFarm$ ||= from(
      getDoc(ref).then((result) => {
        if (!result) throw Error("Tree not found.");
        return result.data() as Farm;
      }),
    ).pipe(shareReplay(1)));
  }

  public watchFarm(id: string): Observable<Farm> {
    return new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      const ref = doc(Firebase.firestore, `farms/${id}`);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (!result.exists) throw Error("Farm does not exist");
        return result.data() as Farm;
      }),
      switchMap((farm) => this.checkIfUserIsMember(farm)),
    );
  }

  private checkIfUserIsMember(farm: Farm): Observable<Farm> {
    return this.authService.getUid().pipe(
      first(),
      map((uid) => {
        if (!(farm.adminMembers.includes(uid) || farm.observerMembers.includes(uid))) throw Error("Not authorized.");
        return farm;
      }),
    );
  }

  private checkIfUserIsAdminMember(farm: Farm): Observable<Farm> {
    return this.authService.getUid().pipe(
      first(),
      map((uid) => {
        if (!farm.adminMembers.includes(uid)) throw Error("Not authorized.");
        return farm;
      }),
    );
  }

  /** Loads farms of Current User and return observable. */
  public loadMyFarms(): Observable<FarmWithId[]> {
    return (this.cachedFarms$ ||= this.loadSubject.pipe(
      switchMap(() => this.authService.getUid()),
      switchMap((uid) => forkJoin([this.getAdminFarms(uid), this.getObservedFarms(uid)])),
      map(([adminFarms, observerFarms]) => [...adminFarms, ...observerFarms]),
      shareReplay(1),
    ));
  }
  /** Refreshes all subscribed farm loaders. */
  public refreshFarms(): void {
    this.loadSubject.next();
  }

  private getAdminFarms(uid: string): Observable<FarmWithId[]> {
    const col = collection(Firebase.firestore, "farms");
    const q = query(col, where("adminMembers", "array-contains", uid));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => ({ ...(doc.data() as Farm), id: doc.id }));
      }),
    );
  }

  private getObservedFarms(uid: string): Observable<FarmWithId[]> {
    const col = collection(Firebase.firestore, "farms");
    const q = query(col, where("observerMembers", "array-contains", uid));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => ({ ...(doc.data() as Farm), id: doc.id }));
      }),
    );
  }

  public createFarm(farmData: Omit<Farm, "areas" | "environmentRecords">) {
    const ref = collection(Firebase.firestore, "farms");
    return addDoc(ref, farmData);
  }

  public updateFarm(id: string, farmData: Partial<Farm>) {
    const ref = doc(Firebase.firestore, `farms/${id}`);
    return updateDoc(ref, farmData);
  }

  public addMembers(farmId: string, newMemberUids: string[], observer = false) {
    return from(this.getFarm(farmId)).pipe(
      map((farm) => (observer ? farm.observerMembers : farm.adminMembers)),
      mergeMap((memberUids) => {
        const mergedUids = [...memberUids, ...newMemberUids];
        return this.updateFarm(farmId, observer ? { observerMembers: mergedUids } : { adminMembers: mergedUids });
      }),
    );
  }

  private uploadPhoto(file: File, farmId: string, treeId: string) {
    const storage = getStorage(app);
    const ref = storageRef(storage, `farms/${farmId}/photo.png`);
    return uploadBytes(ref, file).then((snapshot) => getDownloadURL(snapshot.ref));
  }
}
