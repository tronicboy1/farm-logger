import { Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QuerySnapshot,
  startAfter,
} from 'firebase/firestore';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
import { FarmModule } from './farm.module';
import { CoffeeTreeReport, CoffeeTreeReportWithId } from './tree.model';

@Injectable({
  providedIn: FarmModule,
})
export class TreeReportService {
  private addReportLoadingSubject = new BehaviorSubject(false);
  readonly addingReport$ = this.addReportLoadingSubject.asObservable();
  constructor() {}

  public addReport(farmId: string, areaId: string, treeId: string, reportData: CoffeeTreeReport) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`);
    this.addReportLoadingSubject.next(true);
    return addDoc(ref, reportData).finally(() => this.addReportLoadingSubject.next(false));
  }

  public watchReports(farmId: string, areaId: string, treeId: string): Observable<CoffeeTreeReportWithId[]> {
    return new Observable<QuerySnapshot<DocumentData>>((observer) => {
      const ref = collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`);
      const q = query(ref, orderBy('createdAt', 'desc'));
      return onSnapshot(q, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (result.empty) return [];
        return result.docs.map((doc) => ({ ...(doc.data() as CoffeeTreeReport), id: doc.id }));
      }),
    );
  }

  public getReports(farmId: string, areaId: string, treeId: string, lastDoc?: DocumentData, limitNumber = 10) {
    const constraints: QueryConstraint[] = [orderBy('createdAt'), limit(limitNumber)];
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(
      collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`),
      ...constraints,
    );
    return getDocs(q).then((results) => {
      if (results.empty) return [];
      return results.docs.map((doc) => doc.data() as CoffeeTreeReport);
    });
  }

  public getLatestReport(farmId: string, areaId: string, treeId: string) {
    const q = query(
      collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports`),
      orderBy('createdAt', 'desc'),
      limit(1),
    );
    return from(
      getDocs(q).then((results) => {
        if (results.empty) return null;
        return results.docs[0].data() as CoffeeTreeReport;
      }),
    );
  }

  public removeReport(farmId: string, areaId: string, treeId: string, reportId: string) {
    const ref = doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${treeId}/reports/${reportId}`);
    return deleteDoc(ref);
  }
}
