import { Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { from, map, Observable, OperatorFunction, shareReplay } from 'rxjs';
import { Area, AreaWithId } from './area.model';
import { plantTypePaths } from './plants/plant.model';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  static path = 'environmentRecords';
  static limit = 10;
  private farmIdCache?: string;
  private areasObservableCache$?: Observable<AreaWithId[]>;
  private areaIdCache?: string;
  private areaObservableCache$?: Observable<Area>;

  static getPlantsLink: OperatorFunction<Area, string> = (source) =>
    source.pipe(
      map((area) => /** go to coffee by default */ area.plantType ?? 1),
      map((plantType) => plantTypePaths.get(plantType)!),
      map((plantPath) => `./${plantPath}`),
    );

  public getArea(farmId: string, areaId: string) {
    const ref = doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}`);
    return getDoc(ref).then((result) => {
      if (!result) throw Error('Area not found.');
      return result.data() as Area;
    });
  }

  public watchArea(farmId: string, areaId: string) {
    if (this.farmIdCache !== farmId || this.areaIdCache !== areaId) this.areaObservableCache$ = undefined;
    this.farmIdCache = farmId;
    this.areaIdCache = areaId;
    return (this.areaObservableCache$ ||= new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      const ref = doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}`);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (!result) throw Error('Area not found.');
        return result.data() as Area;
      }),
      shareReplay(1),
    ));
  }

  public watchAreas(farmId: string): Observable<AreaWithId[]> {
    if (this.farmIdCache !== farmId) this.areasObservableCache$ = undefined;
    this.farmIdCache = farmId;
    return (this.areasObservableCache$ ||= new Observable<QuerySnapshot<DocumentData>>((observer) => {
      const ref = this.getRef(farmId);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (result.empty) return [];
        const { docs } = result;
        return docs.map((doc) => ({ ...(doc.data() as Area), id: doc.id }));
      }),
      shareReplay(1),
    ));
  }

  public farmNameIsUnique(farmId: string, areaName: string) {
    const ref = this.getRef(farmId);
    const q = query(ref, where('name', '==', areaName));
    return from(getDocs(q)).pipe(map((result) => result.empty));
  }

  public createArea(farmId: string, areaData: Omit<Area, 'trees' | 'fertilizations' | 'cropdusts'>) {
    const ref = this.getRef(farmId);
    return addDoc(ref, areaData);
  }

  public updateArea(farmId: string, areaId: string, areaData: Partial<Area>) {
    const ref = this.getRef(farmId, areaId);
    return updateDoc(ref, areaData);
  }

  public deleteAreas(farmId: string, areaId: string | string[], ...args: string[]) {
    const coalescedIds = typeof areaId === 'string' ? [areaId, ...args] : [...areaId, ...args];
    const batch = writeBatch(Firebase.firestore);
    const refs = coalescedIds.map((id) => this.getRef(farmId, id));
    refs.forEach((ref) => batch.delete(ref));
    return batch.commit();
  }

  private getRef(farmId: string, areaId?: undefined): CollectionReference<DocumentData>;
  private getRef(farmId: string, areaId: string): DocumentReference<DocumentData>;
  private getRef(farmId: string, areaId?: string) {
    return areaId
      ? doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}`)
      : collection(Firebase.firestore, `farms/${farmId}/areas`);
  }
}
