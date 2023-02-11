import { PaginatedService } from '@farm/paginated.service.abstract';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore';
import type { Observable } from 'rxjs';
import { Plant, PlantWithId } from './plant.model';

export abstract class PlantAbstractService extends PaginatedService {
  static limit: number;

  abstract get(farmId: string, areaId: string, treeId: string): Observable<Plant>;

  /**
   * Used for deleting an area.
   */
  abstract getAll(farmId: string, areaId: string): Promise<QuerySnapshot<DocumentData>>;

  abstract watchOne(farmId: string, areaId: string, treeId: string): Observable<Plant>;

  /**
   * Returns an observable with pagination functions
   */
  abstract watchAll(component: Object, farmId: string, areaId: string): Observable<PlantWithId[]>;
  abstract setSearch(component: any, searchId: string): void;

  abstract create(farmId: string, areaId: string, data: Plant): Promise<any>;

  abstract regularIdIsUnique(farmId: string, areaId: string, regularId: number): Observable<boolean>;

  abstract update(farmId: string, areaId: string, treeId: string, areaData: Partial<Plant>): Promise<void>;

  protected abstract getBasePath(farmId: string, areaId: string): string;
}
