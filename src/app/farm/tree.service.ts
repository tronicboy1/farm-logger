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
  orderBy,
  query,
  startAfter,
  updateDoc,
  limit,
  getDocs,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { map, mergeMap, Observable, ReplaySubject, Subject, switchMap } from "rxjs";
import { FarmModule } from "./farm.module";
import { CoffeeTree, CoffeeTreeReport, CoffeeTreeWithId } from "./tree.model";
import { PhotoService } from "./util/photo.service";

@Injectable({
  providedIn: FarmModule,
})
export class TreeService extends FirebaseFirestore {
  static limit = 20;

  private lastDocSubject = new ReplaySubject<DocumentData | undefined>(1);
  private lastDocCache?: DocumentData;
  private farmIdCache?: string;
  private areaIdCache?: string;
  private treesObservableCache$?: Observable<CoffeeTreeWithId[]>;
  private refreshSubject = new Subject<void>();

  constructor(private photoService: PhotoService) {
    super();
    this.lastDocSubject.next(undefined);
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

  private getTrees(farmId: string, areaId: string, lastDoc?: DocumentData) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    const constraints = [orderBy("regularId", "asc"), limit(TreeService.limit)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(ref, ...constraints);
    return getDocs(q);
  }

  public watchTrees(farmId: string, areaId: string) {
    if (this.farmIdCache !== farmId || this.areaIdCache !== areaId) this.treesObservableCache$ = undefined;
    this.farmIdCache = farmId;
    this.areaIdCache = areaId;
    return (this.treesObservableCache$ ||= this.lastDocSubject.pipe(
      switchMap((lastDoc) => this.getTrees(farmId, areaId, lastDoc)),
      map((result) => {
        if (result.empty) return [];
        const { docs } = result;
        this.lastDocCache = docs[docs.length - 1];
        return docs.map((doc) => ({ ...doc.data(), id: doc.id })) as CoffeeTreeWithId[];
      }),
    ));
  }
  public triggerNextPage() {
    this.lastDocSubject.next(this.lastDocCache);
  }

  public createTree(farmId: string, areaId: string, treeData: Omit<CoffeeTree, "reports">) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    return addDoc(ref, treeData);
  }

  public updateTree(farmId: string, areaId: string, treeId: string, areaData: Partial<CoffeeTree>) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`);
    return updateDoc(ref, areaData);
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

  public getLatestReport(farmId: string, areaId: string, treeId: string) {
    const q = query(
      collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`),
      orderBy("createdAt", "desc"),
      limit(1),
    );
    return getDocs(q).then((results) => {
      if (results.empty) return null;
      return results.docs[0].data() as CoffeeTreeReport;
    });
  }
}
