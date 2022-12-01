import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
import { addDoc, collection, DocumentData, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { FarmModule } from "./farm.module";
import { CoffeeTreeReport } from "./tree.model";

@Injectable({
  providedIn: FarmModule,
})
export class TreeReportService extends FirebaseFirestore {
  constructor() {
    super();
  }

  public addReport(farmId: string, areaId: string, treeId: string, reportData: CoffeeTreeReport) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`);
    return addDoc(ref, reportData);
  }

  public getReports(farmId: string, areaId: string, treeId: string, lastDoc?: DocumentData, limitNumber = 10) {
    const constraints = [orderBy("createdAt"), limit(limitNumber)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(
      collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`),
      ...constraints,
    );
    return getDocs(q).then((results) => {
      if (results.empty) return [];
      return results.docs.map((doc) => doc.data() as CoffeeTreeReport);
    });
  }

  public getLatestReport(farmId: string, areaId: string, treeId: string) {
    const q = query(
      collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`),
      orderBy("createdAt", "desc"),
      limit(1),
    );
    return getDocs(q).then((results) => {
      if (results.empty) return null;
      return results.docs[0].data() as CoffeeTreeReport;
    });
  }
}
