import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { map, Observable } from "rxjs";
import { Area } from "./area.model";
import { FarmModule } from "./farm.module";

@Injectable({
  providedIn: FarmModule,
})
export class AreaService extends FirebaseFirestore {
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
        if (!result.exists) throw Error("Area not found.");
        return result.data() as Area;
      }),
    );
  }

  public createArea(farmId: string, areaData: Omit<Area, "trees">) {
    const ref = collection(this.firestore, `farms/${farmId}/areas`);
    return addDoc(ref, areaData);
  }

  public updateArea(farmId: string, areaId: string, areaData: Partial<Area>) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}`);
    return updateDoc(ref, areaData);
  }
}
