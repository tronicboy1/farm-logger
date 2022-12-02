import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
} from "firebase/firestore";
import { from, map, Observable } from "rxjs";
import { FarmModule } from "./farm.module";

export type Cropdust = {
  completedAt: number;
  type: string;
  note: string;
};
export type CropdustWithId = Cropdust & { id: string };

@Injectable({
  providedIn: FarmModule,
})
export class CropdustService extends FirebaseFirestore {
  static path = "cropdusts";

  constructor() {
    super();
  }

  public addCropdust(farmId: string, areaId: string, cropdustData: Cropdust) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/${CropdustService.path}`);
    return addDoc(ref, cropdustData);
  }

  public watchCropdusts(farmId: string, areaId: string): Observable<CropdustWithId[]> {
    return new Observable<QuerySnapshot<DocumentData>>((observer) => {
      const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/${CropdustService.path}`);
      const q = query(ref, orderBy("completedAt", "desc"));
      return onSnapshot(q, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (result.empty) return [];
        return result.docs.map((doc) => ({ ...(doc.data() as Cropdust), id: doc.id }));
      }),
    );
  }

  public getCropdusts(farmId: string, areaId: string, lastDoc?: DocumentData, limitNumber = 10) {
    const constraints = [orderBy("createdAt"), limit(limitNumber)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(
      collection(this.firestore, `farms/${farmId}/areas/${areaId}/${CropdustService.path}`),
      ...constraints,
    );
    return getDocs(q).then((results) => {
      if (results.empty) return [];
      return results.docs.map((doc) => doc.data() as Cropdust);
    });
  }

  public getLatestCropdust(farmId: string, areaId: string) {
    const q = query(
      collection(this.firestore, `farms/${farmId}/areas/${areaId}/${CropdustService.path}`),
      orderBy("createdAt", "desc"),
      limit(1),
    );
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return null;
        return results.docs[0].data() as Cropdust;
      }),
    );
  }

  public removeCropdust(farmId: string, areaId: string, cropdustId: string) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}/${CropdustService.path}/${cropdustId}`);
    return deleteDoc(ref);
  }
}
