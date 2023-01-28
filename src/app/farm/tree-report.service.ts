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
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  where,
} from 'firebase/firestore';
import {
  BehaviorSubject,
  debounceTime,
  from,
  map,
  Observable,
  OperatorFunction,
  scan,
  startWith,
  Subject,
  switchMap,
  takeWhile,
  tap,
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

  private nextPage$ = new Subject<void>();
  private refresh$ = new Subject<void>();
  public watchReports(farmId: string, areaId: string, treeId: string): Observable<CoffeeTreeReportWithId[]> {
    return this.refresh$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.nextPage$.pipe(
          debounceTime(200),
          startWith(undefined),
          this.loadReportsAndCacheLastDoc(farmId, areaId, treeId),
          takeWhile((result) => !result.empty),
          map((result) => {
            if (result.empty) return [];
            return result.docs.map((doc) => ({ ...(doc.data() as CoffeeTreeReport), id: doc.id }));
          }),
          scan((acc, reports) => [...acc, ...reports], [] as CoffeeTreeReportWithId[]),
        ),
      ),
    );
  }

  private loadReportsAndCacheLastDoc(
    farmId: string,
    areaId: string,
    treeId: string,
  ): OperatorFunction<void, QuerySnapshot<DocumentData>> {
    let lastDocCache: QueryDocumentSnapshot<DocumentData> | undefined;
    return (source) =>
      source.pipe(
        switchMap(() => this.getReports(farmId, areaId, treeId, lastDocCache)),
        tap((result) => {
          if (result.empty) return;
          lastDocCache = result.docs.at(-1);
        }),
      );
  }
  public triggerNextPage() {
    this.nextPage$.next();
  }
  public triggerRefresh() {
    this.refresh$.next();
  }

  private getReports(farmId: string, areaId: string, treeId: string, lastDoc?: DocumentSnapshot<any>, limitNumber = 5) {
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
