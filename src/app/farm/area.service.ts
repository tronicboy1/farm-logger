import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { from, map, Observable, ReplaySubject, shareReplay, Subject } from "rxjs";
import { Area, AreaWithId } from "./area.model";
import { FarmModule } from "./farm.module";

@Injectable({
  providedIn: FarmModule,
})
export class AreaService extends FirebaseFirestore {
  static path = "environmentRecords";
  static limit = 10;
  private lastDocSubject = new ReplaySubject<DocumentData | undefined>(1);
  private lastDocCache?: DocumentData;
  private farmIdCache?: string;
  private refreshSubject = new Subject<void>();
  private areasObservableCache$?: Observable<AreaWithId[]>;

  constructor() {
    super();
  }

  public getArea(farmId: string, areaId: string) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}`);
    return getDoc(ref).then((result) => {
      if (!result) throw Error("Area not found.");
      return result.data() as Area;
    });
  }

  public watchArea(farmId: string, areaId: string) {
    return new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}`);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (!result) throw Error("Area not found.");
        return result.data() as Area;
      }),
    );
  }

  public watchAreas(farmId: string): Observable<AreaWithId[]> {
    if (this.farmIdCache !== farmId) this.areasObservableCache$ = undefined;
    this.farmIdCache = farmId;
    return (this.areasObservableCache$ ||= new Observable<QuerySnapshot<DocumentData>>((observer) => {
      const ref = collection(this.firestore, `farms/${farmId}/areas`);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (result.empty) return [];
        const { docs } = result;
        this.lastDocCache = docs[docs.length - 1];
        return docs.map((doc) => ({ ...(doc.data() as Area), id: doc.id }));
      }),
      shareReplay(1),
    ));
  }

  public farmNameIsUnique(farmId: string, areaName: string) {
    const ref = collection(this.firestore, `farms/${farmId}/areas`);
    const q = query(ref, where("name", "==", areaName));
    return from(getDocs(q)).pipe(map((result) => result.empty));
  }

  public createArea(farmId: string, areaData: Omit<Area, "trees" | "fertilizations" | "cropdusts">) {
    const ref = collection(this.firestore, `farms/${farmId}/areas`);
    return addDoc(ref, areaData);
  }

  public updateArea(farmId: string, areaId: string, areaData: Partial<Area>) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}`);
    return updateDoc(ref, areaData);
  }
}
