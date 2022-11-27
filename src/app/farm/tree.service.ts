import { Injectable } from "@angular/core";
import { app } from "@custom-firebase/firebase";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  limit,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { map, Observable } from "rxjs";
import { FarmModule } from "./farm.module";
import { CoffeeTree, CoffeeTreeReport } from "./tree.model";

@Injectable({
  providedIn: FarmModule,
})
export class TreeService extends FirebaseFirestore {
  constructor() {
    super();
  }

  public getTree(farmId: string, areaId: string, treeId: string) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`);
    return getDoc(ref).then((result) => {
      if (!result) throw Error("Tree not found.");
      return result.data() as CoffeeTree;
    });
  }

  public watchTree(farmId: string, areaId: string, treeId: string) {
    return new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (!result.exists) throw Error("Tree not found.");
        return result.data() as CoffeeTree;
      }),
    );
  }

  public createTree(farmId: string, areaId: string, treeData: Omit<CoffeeTree, "reports">) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    return addDoc(ref, treeData);
  }

  public updateTree(farmId: string, areaId: string, treeId: string, areaData: Partial<CoffeeTree>) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`);
    return updateDoc(ref, areaData);
  }

  private uploadPhoto(file: File, farmId: string, treeId: string) {
    const storage = getStorage(app);
    const ref = storageRef(storage, `farms/${farmId}/trees/${treeId}`);
    return uploadBytes(ref, file).then((snapshot) => getDownloadURL(snapshot.ref));
  }

  public addReport(farmId: string, areaId: string, treeId: string, reportData: CoffeeTreeReport) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`);
    return addDoc(ref, reportData);
  }

  public getReports(farmId: string, areaId: string, treeId: string, lastDoc?: DocumentData, limitNumber = 10) {
    const constraints = [orderBy("createdAt"), limit(limitNumber)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`), ...constraints);
    return getDocs(q).then((results) => {
      if (results.empty) return [];
      return results.docs.map((doc) => doc.data() as CoffeeTreeReport);
    });
  }
}
