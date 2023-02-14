import { Injectable } from '@angular/core';
import { Firebase } from '@custom-firebase/index';
import { PaginatedService, SubjectCache } from '@farm/paginated.service.abstract';
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
  QueryConstraint,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore';
import {
  BehaviorSubject,
  combineLatest,
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
import { IncludeId, Plant, plantTypePaths, PlantTypes } from './plant.model';
import { PlantAbstractService } from './plant.service.abstract';

@Injectable({ providedIn: 'root' })
export class PlantService<T extends Plant = Plant> implements PaginatedService, PlantAbstractService {
  static limit = 20;
  /**
   * Must be overwritten to change path in children.
   */
  protected plantType = PlantTypes.Plant;

  public get(farmId: string, areaId: string, plantId: string) {
    const ref = this.getRef(farmId, areaId, plantId);
    return from(
      getDoc(ref).then((result) => {
        if (!result) throw Error('Tree not found.');
        return result.data() as T;
      }),
    );
  }

  getAll(farmId: string, areaId: string) {
    return getDocs(this.getRef(farmId, areaId));
  }

  public watchOne(farmId: string, areaId: string, plantId: string) {
    return new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      return onSnapshot(
        this.getRef(farmId, areaId, plantId),
        (result) => observer.next(result),
        observer.error,
        observer.complete,
      );
    }).pipe(
      map((result) => {
        if (!result.exists) throw Error('Tree not found.');
        return result.data() as T;
      }),
    );
  }

  private getPlants(farmId: string, areaId: string, lastDoc?: DocumentData, searchId?: number) {
    let constraints: QueryConstraint[] = [orderBy('regularId', 'asc'), limit(PlantService.limit)];
    if (searchId) {
      constraints = [where('regularId', '==', searchId)];
    }
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(this.getRef(farmId, areaId), ...constraints);
    return getDocs(q);
  }

  private nextPageSubjectCache = new WeakMap() as SubjectCache;
  private refreshSubjectCache = new WeakMap() as SubjectCache;
  private searchIdSubjectCache = new WeakMap<Object, BehaviorSubject<any>>();
  private treesLoadingSubject = new BehaviorSubject(true);
  readonly treesLoading$ = this.treesLoadingSubject.asObservable();
  public watchAll(component: Object, farmId: string, areaId: string) {
    const nextPage$ = new Subject<void>();
    const refreshSubject = new Subject<void>();
    const searchId$ = new BehaviorSubject<number | undefined>(undefined);
    this.nextPageSubjectCache.set(component, nextPage$);
    this.refreshSubjectCache.set(component, refreshSubject);
    this.searchIdSubjectCache.set(component, searchId$);
    return combineLatest([searchId$, refreshSubject.pipe(startWith(undefined))]).pipe(
      switchMap(([searchValue]) =>
        nextPage$.pipe(
          debounceTime(100),
          startWith(undefined),
          tap({ next: () => this.treesLoadingSubject.next(true) }),
          this.loadPlantsAndCacheLastDoc(farmId, areaId, searchValue),
          tap({ next: () => this.treesLoadingSubject.next(false) }),
          takeWhile((result) => !result.empty),
          map((result) => {
            if (result.empty) return [];
            const { docs } = result;
            return docs.map((doc) => ({ ...doc.data(), id: doc.id })) as (T & IncludeId)[];
          }),
          scan((acc, current) => [...acc, ...current], [] as (T & IncludeId)[]),
        ),
      ),
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
    refresh$.next();
  }
  public setSearch(component: Object, searchId: string) {
    const searchId$ = this.searchIdSubjectCache.get(component);
    if (!searchId$) throw ReferenceError('Search subject not in cache.');
    const searchNumber = Number(searchId);
    searchId$.next(isNaN(searchNumber) ? undefined : searchNumber);
  }

  private loadPlantsAndCacheLastDoc(
    farmId: string,
    areaId: string,
    searchValue: number | undefined,
  ): OperatorFunction<void, QuerySnapshot<DocumentData>> {
    let lastDocCache: QueryDocumentSnapshot<DocumentData> | undefined;
    return (source) =>
      source.pipe(
        switchMap(() => this.getPlants(farmId, areaId, lastDocCache, searchValue)),
        tap((result) => {
          if (result.empty) return;
          lastDocCache = result.docs.at(-1);
        }),
      );
  }

  public create(farmId: string, areaId: string, data: Omit<T, 'plantType'> & Partial<Pick<T, 'plantType'>>) {
    return addDoc(this.getRef(farmId, areaId), { ...data, plantType: this.plantType });
  }

  public regularIdIsUnique(farmId: string, areaId: string, regularId: number) {
    const q = query(this.getRef(farmId, areaId), where('regularId', '==', regularId));
    return from(getDocs(q)).pipe(map((result) => result.empty));
  }

  public update(farmId: string, areaId: string, plantId: string, data: Partial<Plant> & Partial<T>) {
    const ref = this.getRef(farmId, areaId, plantId);
    return updateDoc(ref, data);
  }

  private getRef(farmId: string, areaId: string): CollectionReference<DocumentData>;
  private getRef(farmId: string, areaId: string, plantId: string): DocumentReference<DocumentData>;
  private getRef(farmId: string, areaId: string, plantId?: string) {
    return plantId
      ? doc(Firebase.firestore, `${this.getBasePath(farmId, areaId)}/${plantId}`)
      : collection(Firebase.firestore, this.getBasePath(farmId, areaId));
  }

  /**
   * Use to override plant storage path
   */
  private getBasePath(farmId: string, areaId: string) {
    const path = plantTypePaths.get(this.plantType);
    if (!path) throw ReferenceError('Path not found.');
    return `farms/${farmId}/areas/${areaId}/${path}`;
  }
}
