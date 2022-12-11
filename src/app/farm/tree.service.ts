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
  where,
} from "firebase/firestore";
import {
  BehaviorSubject,
  from,
  map,
  mergeWith,
  Observable,
  ReplaySubject,
  scan,
  shareReplay,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs";
import { FarmModule } from "./farm.module";
import { CoffeeTree, CoffeeTreeWithId } from "./tree.model";

@Injectable({
  providedIn: FarmModule,
})
export class TreeService extends FirebaseFirestore {
  static limit = 20;

  private lastDocSubject = new ReplaySubject<DocumentData | undefined>(1);
  private lastDocCache?: DocumentData;
  private farmIdCache?: string;
  private areaIdCache?: string;
  private searchId$ = new BehaviorSubject<number | undefined>(undefined);
  private treesObservableCache$?: Observable<CoffeeTreeWithId[]>;
  private refreshSubject = new Subject<void>();

  constructor() {
    super();
    this.lastDocSubject.next(undefined);
  }

  public getTree(farmId: string, areaId: string, treeId: string) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`);
    return from(
      getDoc(ref).then((result) => {
        if (!result) throw Error("Tree not found.");
        return result.data() as CoffeeTree;
      }),
    );
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

  private getTrees(farmId: string, areaId: string, lastDoc?: DocumentData, searchId?: number) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    let constraints = [orderBy("regularId", "asc"), limit(TreeService.limit)];
    if (searchId) {
      constraints = [where("regularId", "==", searchId)];
    }
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(ref, ...constraints);
    return getDocs(q);
  }

  public watchTrees(farmId: string, areaId: string) {
    if (this.farmIdCache !== farmId || this.areaIdCache !== areaId) this.treesObservableCache$ = undefined;
    this.farmIdCache = farmId;
    this.areaIdCache = areaId;
    return (this.treesObservableCache$ ||= this.lastDocSubject.pipe(
      withLatestFrom(this.searchId$),
      switchMap(([lastDoc, searchId]) => this.getTrees(farmId, areaId, lastDoc, searchId)),
      map((result) => {
        if (result.empty) return [];
        const { docs } = result;
        this.lastDocCache = docs[docs.length - 1];
        return docs.map((doc) => ({ ...doc.data(), id: doc.id })) as CoffeeTreeWithId[];
      }),
      map((records) => ({ records, reset: false })),
      mergeWith(this.refreshSubject.pipe(map(() => ({ reset: true, records: [] })))),
      scan((acc, current) => {
        if (current.reset) {
          return (acc = []);
        }
        return [...acc, ...current.records];
      }, [] as CoffeeTreeWithId[]),
      shareReplay(1),
    ));
  }
  public triggerNextPage() {
    this.lastDocSubject.next(this.lastDocCache);
  }
  public clearPaginationCache() {
    this.lastDocCache = undefined;
    this.lastDocSubject.next(undefined);
    this.refreshSubject.next();
  }
  public setSearch(searchId: string) {
    const searchNumber = Number(searchId);
    this.searchId$.next(isNaN(searchNumber) ? undefined : searchNumber);
    this.clearPaginationCache();
  }

  public createTree(farmId: string, areaId: string, treeData: Omit<CoffeeTree, "reports">) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    return addDoc(ref, treeData);
  }

  public treeRegularIdIsUnique(farmId: string, areaId: string, regularId: number) {
    const ref = collection(this.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    const q = query(ref, where("regularId", "==", regularId));
    return from(getDocs(q)).pipe(map((result) => result.empty));
  }

  public updateTree(farmId: string, areaId: string, treeId: string, areaData: Partial<CoffeeTree>) {
    const ref = doc(this.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}`);
    return updateDoc(ref, areaData);
  }
}
