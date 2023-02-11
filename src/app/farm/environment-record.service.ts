import { Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
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
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  updateDoc,
} from 'firebase/firestore';
import {
  debounceTime,
  map,
  OperatorFunction,
  ReplaySubject,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { FarmModule } from './farm.module';
import { PaginatedService, SubjectCache } from './paginated.service.abstract';

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
export class EnvironmentRecordService implements PaginatedService {
  static path = 'environmentRecords';
  static limit = 20;
  private lastDocSubject = new ReplaySubject<DocumentData | undefined>(1);

  constructor() {
    this.lastDocSubject.next(undefined);
  }

  public getEnvironmentRecords(farmId: string, lastDoc?: DocumentData) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/${EnvironmentRecordService.path}`);
    const constraints: QueryConstraint[] = [limit(EnvironmentRecordService.limit), orderBy('createdAt', 'desc')];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(ref, ...constraints);
    return getDocs(q);
  }

  private nextPageSubjectCache = new WeakMap() as SubjectCache;
  private refreshSubjectCache = new WeakMap() as SubjectCache;
  public watchAll(component: Object, farmId: string) {
    const nextPage$ = new Subject<void>();
    const refresh$ = new Subject<void>();
    this.nextPageSubjectCache.set(component, nextPage$);
    this.refreshSubjectCache.set(component, refresh$);
    const refreshWithInitial$ = refresh$.pipe(startWith(undefined));
    return refreshWithInitial$.pipe(
      switchMap(() =>
        nextPage$.pipe(
          debounceTime(100),
          startWith(undefined),
          this.loadRecordsAndCacheLastDoc(farmId),
          takeWhile((results) => !results.empty),
          map((results) => {
            if (results.empty) return [];
            return results.docs.map((doc) => doc.data() as EnvironmentRecord);
          }),
          scan((acc, current) => {
            return [...acc, ...current];
          }, [] as EnvironmentRecord[]),
        ),
      ),
      shareReplay(1),
    );
  }
  public triggerNextPage(component: Object) {
    const nextPage$ = this.nextPageSubjectCache.get(component);
    if (!nextPage$) throw ReferenceError('next page subject not in cache.');
    nextPage$.next();
  }
  public clearPaginationCache(component: Object) {
    const refresh$ = this.refreshSubjectCache.get(component);
    if (!refresh$) throw ReferenceError('Refresh subject not in cache.');
    console.log('next', refresh$);
    refresh$.next();
  }

  private loadRecordsAndCacheLastDoc(farmId: string): OperatorFunction<void, QuerySnapshot<DocumentData>> {
    let lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
    return (source) =>
      source.pipe(
        switchMap(() => this.getEnvironmentRecords(farmId, lastDoc)),
        tap((results) => {
          lastDoc = results.docs.at(-1);
        }),
      );
  }

  public createEnvironmentRecord(farmId: string, environmentRecordData: EnvironmentRecord) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/${EnvironmentRecordService.path}`);
    return addDoc(ref, environmentRecordData);
  }

  public update(farmId: string, environmentRecordId: string, environmentRecordData: Partial<EnvironmentRecord>) {
    const ref = doc(Firebase.firestore, `farms/${farmId}/${EnvironmentRecordService.path}/${environmentRecordId}`);
    return updateDoc(ref, environmentRecordData);
  }
}
