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
import { Plant, PlantWithId } from './plant.model';
import { PlantAbstractService } from './plant.service.abstract';

export class PlantService<T extends Plant = Plant> extends PlantAbstractService implements PaginatedService {
  static limit = 20;

  public get(farmId: string, areaId: string, plantId: string) {
    const ref = this.getRef(farmId, areaId, plantId);
    return from(
      getDoc(ref).then((result) => {
        if (!result) throw Error('Tree not found.');
        return result.data() as T;
      }),
    );
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
    return addDoc(this.getRef(farmId, areaId), data);
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

  protected getBasePath(farmId: string, areaId: string) {
    return `farms/${farmId}/areas/${areaId}/plants`;
  }
}
