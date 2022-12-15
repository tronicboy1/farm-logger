import { Injectable } from "@angular/core";
import { Firebase } from "@custom-firebase/index";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { map, mergeWith, Observable, ReplaySubject, scan, shareReplay, Subject, switchMap } from "rxjs";
import { FarmModule } from "./farm.module";

export type EnvironmentRecord = {
  createdAt: number;
  weather: string;
  high: number;
  low: number;
  solarRadiation?: number;
  windSpeed: number;
  rainfall?: number;
  humidity?: number;
  sunrise?: number;
  sunset?: number;
  clouds?: number;
};

@Injectable({
  providedIn: FarmModule,
})
export class EnvironmentRecordService {
  static path = "environmentRecords";
  static limit = 20;
  private lastDocSubject = new ReplaySubject<DocumentData | undefined>(1);
  private lastDocCache?: DocumentData;
  private farmIdCache?: string;
  private refreshSubject = new Subject<void>();
  private environmentRecordsCache$?: Observable<EnvironmentRecord[]>;

  constructor() {
    this.lastDocSubject.next(undefined);
  }

  public getEnvironmentRecords(farmId: string, lastDoc?: DocumentData) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/${EnvironmentRecordService.path}`);
    const constraints: QueryConstraint[] = [limit(EnvironmentRecordService.limit), orderBy("createdAt", "desc")];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(ref, ...constraints);
    return getDocs(q).then((result) => {
      if (result.empty) return [];
      this.lastDocCache = result.docs[result.docs.length - 1];
      return result.docs.map((doc) => doc.data()) as EnvironmentRecord[];
    });
  }

  public watchEnvironmentRecords(farmId: string) {
    if (farmId !== this.farmIdCache) this.environmentRecordsCache$ = undefined;
    this.farmIdCache = farmId;
    return (this.environmentRecordsCache$ ||= this.lastDocSubject.pipe(
      switchMap((lastDoc) => this.getEnvironmentRecords(farmId, lastDoc)),
      map((records) => ({ records, reset: false })),
      mergeWith(this.refreshSubject.pipe(map(() => ({ reset: true, records: [] })))),
      scan((acc, current) => {
        if (current.reset) {
          return (acc = []);
        }
        return [...acc, ...current.records];
      }, [] as EnvironmentRecord[]),
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

  public createEnvironmentRecord(farmId: string, environmentRecordData: EnvironmentRecord) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/${EnvironmentRecordService.path}`);
    return addDoc(ref, environmentRecordData);
  }

  public updateTree(farmId: string, environmentRecordId: string, environmentRecordData: Partial<EnvironmentRecord>) {
    const ref = doc(Firebase.firestore, `farms/${farmId}/${EnvironmentRecordService.path}/${environmentRecordId}`);
    return updateDoc(ref, environmentRecordData);
  }
}
