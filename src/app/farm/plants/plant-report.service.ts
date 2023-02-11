import { inject, Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
import { PaginatedService } from '@farm/paginated.service.abstract';
import { PhotoService } from '@farm/util/photo.service';
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
import { PlantReportServiceAbstract } from './plant-report.service.abstract';
import { PlantReport, PlantReportWithId } from './plant.model';

@Injectable({
  providedIn: 'root',
})
export class PlantReportService<T extends PlantReport = PlantReport>
  implements PaginatedService, PlantReportServiceAbstract
{
  private addReportLoadingSubject = new BehaviorSubject(false);
  readonly addingReport$ = this.addReportLoadingSubject.asObservable();
  private photoService = inject(PhotoService)

  public addReport(farmId: string, areaId: string, plantId: string, reportData: T) {
    const ref = this.getRef(farmId, areaId, plantId);
    this.addReportLoadingSubject.next(true);
    return addDoc(ref, reportData).finally(() => this.addReportLoadingSubject.next(false));
  }

  private nextPage$ = new Subject<void>();
  private refresh$ = new Subject<void>();
  public watchAll(farmId: string, areaId: string, plantId: string): Observable<(T & PlantReportWithId)[]> {
    return this.refresh$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.nextPage$.pipe(
          debounceTime(200),
          startWith(undefined),
          this.loadReportsAndCacheLastDoc(farmId, areaId, plantId),
          takeWhile((result) => !result.empty),
          map((result) => {
            if (result.empty) return [];
            return result.docs.map((doc) => ({ ...(doc.data() as T), id: doc.id }));
          }),
          scan((acc, reports) => [...acc, ...reports], [] as (T & PlantReportWithId)[]),
        ),
      ),
    );
  }

  private loadReportsAndCacheLastDoc(
    farmId: string,
    areaId: string,
    plantId: string,
  ): OperatorFunction<void, QuerySnapshot<DocumentData>> {
    let lastDocCache: QueryDocumentSnapshot<DocumentData> | undefined;
    return (source) =>
      source.pipe(
        switchMap(() => this.getReports(farmId, areaId, plantId, lastDocCache)),
        tap((result) => {
          if (result.empty) return;
          lastDocCache = result.docs.at(-1);
        }),
      );
  }
  public triggerNextPage() {
    this.nextPage$.next();
  }
  public clearPaginationCache() {
    this.refresh$.next();
  }

  private getReports(
    farmId: string,
    areaId: string,
    plantId: string,
    lastDoc?: DocumentSnapshot<any>,
    limitNumber = 5,
  ) {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(limitNumber)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(this.getRef(farmId, areaId, plantId), ...constraints);
    return getDocs(q);
  }

  public getAllReports(farmId: string, areaId: string, plantId: string) {
    return from(getDocs(this.getRef(farmId, areaId, plantId))).pipe(
      map((results) => {
        if (results.empty) return [];
        return results.docs.map((doc) => doc.data() as T);
      }),
    );
  }

  public getLatestReport(farmId: string, areaId: string, plantId: string): Observable<T | undefined> {
    const q = query(this.getRef(farmId, areaId, plantId), orderBy('createdAt', 'desc'), limit(1));
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return undefined;
        return results.docs[0].data() as T;
      }),
    );
  }

  public getLatestIndividualFertilization(farmId: string, areaId: string, plantId: string): Observable<T | undefined> {
    const q = query(
      this.getRef(farmId, areaId, plantId),
      orderBy('createdAt', 'desc'),
      where('individualFertilization', '==', true),
      limit(1),
    );
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return undefined;
        return results.docs[0].data() as T;
      }),
    );
  }

  public removeReport(farmId: string, areaId: string, plantId: string, reportId: string) {
    const ref = this.getRef(farmId, areaId, plantId, reportId);
    return getDoc(ref)
      .then((doc) => {
        if (!doc.exists) throw Error('report did not exist');
        const data = doc.data() as T;
        if (!data.photoPath) return Promise.resolve();
        return this.photoService.deletePhoto(data.photoPath);
      })
      .then(() => deleteDoc(ref));
  }

  private getRef(farmId: string, areaId: string, plantId: string): CollectionReference<DocumentData>;
  private getRef(farmId: string, areaId: string, plantId: string, reportId: string): DocumentReference<DocumentData>;
  private getRef(farmId: string, areaId: string, plantId: string, reportId?: string) {
    const basePath = this.getBasePath(farmId, areaId, plantId);
    return reportId ? doc(Firebase.firestore, `${basePath}/${reportId}`) : collection(Firebase.firestore, basePath);
  }

  /**
   * Used to override firestore path in inheritance
   */
  protected getBasePath(farmId: string, areaId: string, plantId: string) {
    return `farms/${farmId}/areas/${areaId}/plants/${plantId}/reports`;
  }
}
