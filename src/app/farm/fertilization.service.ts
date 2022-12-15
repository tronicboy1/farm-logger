import { Injectable } from "@angular/core";
import { Firebase } from "@custom-firebase/index";
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
  QueryConstraint,
  QuerySnapshot,
  startAfter,
} from "firebase/firestore";
import { from, map, Observable } from "rxjs";
import { FarmModule } from "./farm.module";

export type Fertilization = {
  completedAt: number;
  type: string;
  note: string;
};
export type FertilizationWithId = Fertilization & { id: string };

@Injectable({
  providedIn: FarmModule,
})
export class FertilizationService {
  static path = "fertilizations";

  constructor() {
  }

  public addFertilization(farmId: string, areaId: string, fertilizationData: Fertilization) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/${FertilizationService.path}`);
    return addDoc(ref, fertilizationData);
  }

  public watchFertilizations(farmId: string, areaId: string): Observable<FertilizationWithId[]> {
    return new Observable<QuerySnapshot<DocumentData>>((observer) => {
      const ref = collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/${FertilizationService.path}`);
      const q = query(ref, orderBy("completedAt", "desc"));
      return onSnapshot(q, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (result.empty) return [];
        return result.docs.map((doc) => ({ ...(doc.data() as Fertilization), id: doc.id }));
      }),
    );
  }

  public getFertilizations(farmId: string, areaId: string, lastDoc?: DocumentData, limitNumber = 10) {
    const constraints: QueryConstraint[] = [orderBy("createdAt"), limit(limitNumber)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(
      collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/${FertilizationService.path}`),
      ...constraints,
    );
    return getDocs(q).then((results) => {
      if (results.empty) return [];
      return results.docs.map((doc) => doc.data() as Fertilization);
    });
  }

  public getLatestFertilization(farmId: string, areaId: string) {
    const q = query(
      collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/${FertilizationService.path}`),
      orderBy("createdAt", "desc"),
      limit(1),
    );
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return null;
        return results.docs[0].data() as Fertilization;
      }),
    );
  }

  public removeFertilization(farmId: string, areaId: string, fertilizationId: string) {
    const ref = doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}/${FertilizationService.path}/${fertilizationId}`);
    return deleteDoc(ref);
  }
}
