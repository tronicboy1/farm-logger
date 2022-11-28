import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
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
import { forkJoin, from, map, mergeMap, Observable, ReplaySubject, shareReplay, switchMap } from "rxjs";
import { Farm, FarmWithId } from "./farm.model";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { app } from "@custom-firebase/firebase";
import { AuthService } from "@user/auth.service";

@Injectable({
  providedIn: FarmModule,
})
export class FarmService extends FirebaseFirestore {
  private loadSubject = new ReplaySubject<void>();
  private cachedFarms$?: Observable<FarmWithId[]>;

  constructor(private authService: AuthService) {
    super();
    this.loadSubject.next();
  }

  public getFarm(id: string) {
    const ref = doc(this.firestore, `farms/${id}`);
    return getDoc(ref).then((result) => {
      if (!result) throw Error("Tree not found.");
      return result.data() as Farm;
    });
  }

  public watchFarm(id: string) {
    return new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      const ref = doc(this.firestore, `farms/${id}`);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (!result.exists) throw Error("Farm does not exist");
        return result.data() as Farm;
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
    const col = collection(this.firestore, "farms");
    const q = query(col, where("adminMembers", "array-contains", uid));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => ({...(doc.data() as Farm), id: doc.id}));
      }),
    );
  }

  private getObservedFarms(uid: string): Observable<FarmWithId[]> {
    const col = collection(this.firestore, "farms");
    const q = query(col, where("observerMembers", "array-contains", uid));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => ({...(doc.data() as Farm), id: doc.id}));
      }),
    );
  }

  public createFarm(farmData: Omit<Farm, "areas">) {
    const ref = collection(this.firestore, "farms");
    return addDoc(ref, farmData);
  }

  public updateFarm(id: string, farmData: Partial<Farm>) {
    const ref = doc(this.firestore, `farms/${id}`);
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
