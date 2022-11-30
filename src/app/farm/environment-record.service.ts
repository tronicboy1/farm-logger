import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { mergeMap, Observable, ReplaySubject, shareReplay, switchMap, tap } from "rxjs";
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
  sunrise: number;
  sunset: number;
  clouds: number;
};

@Injectable({
  providedIn: FarmModule,
})
export class EnvironmentRecordService extends FirebaseFirestore {
  static path = "environmentRecords";
  static limit = 10;
  private lastDocSubject = new ReplaySubject<DocumentData | undefined>(1);
  private lastDocCache?: DocumentData;
  private farmIdCache?: string;
  private refreshSubject = new ReplaySubject<void>(1);
  private environmentRecordsCache$?: Observable<EnvironmentRecord[]>;

  constructor() {
    super();
    this.lastDocSubject.next(undefined);
    this.refreshSubject.next();
  }

  public getEnvironmentRecords(farmId: string, lastDoc?: DocumentData) {
    const ref = collection(this.firestore, `farms/${farmId}/${EnvironmentRecordService.path}`);
    const constraints = [limit(EnvironmentRecordService.limit), orderBy("createdAt", "asc")];
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
    return (this.environmentRecordsCache$ ||= this.refreshSubject.pipe(
      switchMap(() => this.lastDocSubject),
      mergeMap((lastDoc) => this.getEnvironmentRecords(farmId, lastDoc)),
      tap(console.log),
      shareReplay(1),
    ));
  }
  public triggerNextPage() {
    this.lastDocSubject.next(this.lastDocCache);
  }
  public clearCache() {
    this.lastDocSubject.next(undefined);
  }

  public createEnvironmentRecord(farmId: string, environmentRecordData: EnvironmentRecord) {
    const ref = collection(this.firestore, `farms/${farmId}/${EnvironmentRecordService.path}`);
    return addDoc(ref, environmentRecordData);
  }

  public updateTree(farmId: string, environmentRecordId: string, environmentRecordData: Partial<EnvironmentRecord>) {
    const ref = doc(this.firestore, `farms/${farmId}/${EnvironmentRecordService.path}/${environmentRecordId}`);
    return updateDoc(ref, environmentRecordData);
  }
}
