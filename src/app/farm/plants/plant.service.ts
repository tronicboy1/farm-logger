import { Firebase } from '@custom-firebase/index';
import { PaginatedService } from '@farm/paginated.service.abstract';
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
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { Plant, PlantWithId } from './plant.model';
import { PlantAbstractService } from './plant.service.abstract';

export class PlantService<T extends Plant = Plant> implements PlantAbstractService, PaginatedService {
  static limit = 20;

  public getPlant(farmId: string, areaId: string, plantId: string) {
    const ref = doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${plantId}`);
    return from(
      getDoc(ref).then((result) => {
        if (!result) throw Error('Tree not found.');
        return result.data() as T;
      }),
    );
  }

  public watchPlant(farmId: string, areaId: string, plantId: string) {
    return new Observable<DocumentSnapshot<DocumentData>>((observer) => {
      const ref = doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${plantId}`);
      return onSnapshot(ref, (result) => observer.next(result), observer.error, observer.complete);
    }).pipe(
      map((result) => {
        if (!result.exists) throw Error('Tree not found.');
        return result.data() as T;
      }),
    );
  }

  private getPlants(farmId: string, areaId: string, lastDoc?: DocumentData, searchId?: number) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    let constraints: QueryConstraint[] = [orderBy('regularId', 'asc'), limit(PlantService.limit)];
    if (searchId) {
      constraints = [where('regularId', '==', searchId)];
    }
    if (lastDoc) constraints.push(startAfter(lastDoc));
    const q = query(ref, ...constraints);
    return getDocs(q);
  }

  private nextPage$ = new Subject<void>();
  private searchId$ = new BehaviorSubject<number | undefined>(undefined);
  private treesLoadingSubject = new BehaviorSubject(true);
  readonly treesLoading$ = this.treesLoadingSubject.asObservable();
  private refreshSubject = new Subject<void>();
  public watchAll(farmId: string, areaId: string) {
    return combineLatest([this.searchId$, this.refreshSubject.pipe(startWith(undefined))]).pipe(
      switchMap(([searchValue]) =>
        this.nextPage$.pipe(
          debounceTime(100),
          startWith(undefined),
          tap({ next: () => this.treesLoadingSubject.next(true) }),
          this.loadPlantsAndCacheLastDoc(farmId, areaId, searchValue),
          tap({ next: () => this.treesLoadingSubject.next(false) }),
          takeWhile((result) => !result.empty),
          map((result) => {
            if (result.empty) return [];
            const { docs } = result;
            return docs.map((doc) => ({ ...doc.data(), id: doc.id })) as (T & PlantWithId)[];
          }),
          scan((acc, current) => [...acc, ...current], [] as (T & PlantWithId)[]),
        ),
      ),
      shareReplay(1),
    );
  }
  public triggerNextPage() {
    this.nextPage$.next();
  }
  public clearPaginationCache() {
    this.refreshSubject.next();
  }
  public setSearch(searchId: string) {
    const searchNumber = Number(searchId);
    this.searchId$.next(isNaN(searchNumber) ? undefined : searchNumber);
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

  public create(farmId: string, areaId: string, data: T) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    return addDoc(ref, data);
  }

  public regularIdIsUnique(farmId: string, areaId: string, regularId: number) {
    const ref = collection(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees`);
    const q = query(ref, where('regularId', '==', regularId));
    return from(getDocs(q)).pipe(map((result) => result.empty));
  }

  public update(farmId: string, areaId: string, plantId: string, data: Partial<Plant> & Partial<T>) {
    const ref = doc(Firebase.firestore, `farms/${farmId}/areas/${areaId}/trees/${plantId}`);
    return updateDoc(ref, data);
  }
}
