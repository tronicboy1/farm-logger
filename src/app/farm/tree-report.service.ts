import { Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  where,
} from 'firebase/firestore';
import {
  BehaviorSubject,
  distinctUntilChanged,
  from,
  map,
  mergeMap,
  Observable,
  ReplaySubject,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeWhile,
} from 'rxjs';
import { FarmModule } from './farm.module';
import { CoffeeTreeReport, CoffeeTreeReportWithId } from './tree.model';
import { PhotoService } from './util/photo.service';

@Injectable({
  providedIn: FarmModule,
})
export class TreeReportService {
  private addReportLoadingSubject = new BehaviorSubject(false);
  readonly addingReport$ = this.addReportLoadingSubject.asObservable();
  constructor(private photoService: PhotoService) {}

  public addReport(farmId: string, areaId: string, treeId: string, reportData: CoffeeTreeReport) {
    const ref = this.getRef(farmId, areaId, treeId);
    this.addReportLoadingSubject.next(true);
    return addDoc(ref, reportData).finally(() => this.addReportLoadingSubject.next(false));
  }

  private treeIdCache?: string;
  private reportsCache$?: Observable<CoffeeTreeReportWithId[]>;
  private lastDocCache?: DocumentData;
  private lastDoc$ = new ReplaySubject<DocumentData | undefined>();
  private refresh$ = new Subject<void>();
  public watchReports(farmId: string, areaId: string, treeId: string): Observable<CoffeeTreeReportWithId[]> {
    if (treeId !== this.treeIdCache) {
      this.treeIdCache = treeId;
      this.reportsCache$ = undefined;
      this.lastDocCache = undefined;
    }
    return (this.reportsCache$ ||= this.refresh$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.lastDoc$.pipe(
          startWith(undefined),
          distinctUntilChanged(),
          mergeMap((lastDoc) => this.getReports(farmId, areaId, treeId, lastDoc)),
          takeWhile((result) => !result.empty),
          map((result) => {
            if (result.empty) return [];
            this.lastDocCache = result.docs.at(-1)!;
            return result.docs.map((doc) => ({ ...(doc.data() as CoffeeTreeReport), id: doc.id }));
          }),
          scan((acc, reports) => [...acc, ...reports], [] as CoffeeTreeReportWithId[]),
        ),
      ),
      shareReplay(1),
    ));
  }
  public triggerNextPage() {
    this.lastDoc$.next(this.lastDocCache);
  }
  public triggerRefresh() {
    this.lastDocCache = undefined;
    this.lastDoc$.next(undefined);
    this.refresh$.next();
  }

  private getReports(farmId: string, areaId: string, treeId: string, lastDoc?: DocumentData, limitNumber = 5) {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(limitNumber)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(this.getRef(farmId, areaId, treeId), ...constraints);
    return getDocs(q);
  }

  public getAllReports(farmId: string, areaId: string, treeId: string) {
    return getDocs(this.getRef(farmId, areaId, treeId)).then((results) => {
      if (results.empty) return [];
      return results.docs.map((doc) => doc.data() as CoffeeTreeReport);
    });
  }

  public getLatestReport(farmId: string, areaId: string, treeId: string): Observable<CoffeeTreeReport | undefined> {
    const q = query(this.getRef(farmId, areaId, treeId), orderBy('createdAt', 'desc'), limit(1));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return undefined;
        return results.docs[0].data() as CoffeeTreeReport;
      }),
    );
  }

  public getLatestIndividualFertilization(
    farmId: string,
    areaId: string,
    treeId: string,
  ): Observable<CoffeeTreeReport | undefined> {
    const q = query(
      this.getRef(farmId, areaId, treeId),
      orderBy('createdAt', 'desc'),
      where('individualFertilization', '==', true),
      limit(1),
    );
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return undefined;
        return results.docs[0].data() as CoffeeTreeReport;
      }),
    );
  }

  public removeReport(farmId: string, areaId: string, treeId: string, reportId: string) {
    const ref = this.getRef(farmId, areaId, treeId, reportId);
    return getDoc(ref)
      .then((doc) => {
        if (!doc.exists) throw Error('report did not exist');
        const data = doc.data() as CoffeeTreeReport;
        if (!data.photoPath) return Promise.resolve();
        return this.photoService.deletePhoto(data.photoPath);
      })
      .then(() => deleteDoc(ref));
  }

  private getRef(farmId: string, areaId: string, treeId: string): CollectionReference<DocumentData>;
  private getRef(farmId: string, areaId: string, treeId: string, reportId: string): DocumentReference<DocumentData>;
  private getRef(farmId: string, areaId: string, treeId: string, reportId?: string) {
    return reportId
      ? doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports/${reportId}`)
      : collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`);
  }
}
