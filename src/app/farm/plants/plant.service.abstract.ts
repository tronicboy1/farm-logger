import { PaginatedService } from '@farm/paginated.service.abstract';
import { Observable } from 'rxjs';
import { Plant, PlantWithId } from './plant.model';

export abstract class PlantAbstractService extends PaginatedService {
  static limit: number;

  abstract get(farmId: string, areaId: string, treeId: string): Observable<Plant>;

  abstract watchOne(farmId: string, areaId: string, treeId: string): Observable<Plant>;

  /**
   * Returns an observable with pagination functions
   */
  abstract watchAll(farmId: string, areaId: string): Observable<PlantWithId[]>;
  abstract setSearch(searchId: string): void;

  abstract create(farmId: string, areaId: string, data: Plant): Promise<any>;

  abstract regularIdIsUnique(farmId: string, areaId: string, regularId: number): Observable<boolean>;

  abstract update(farmId: string, areaId: string, treeId: string, areaData: Partial<Plant>): Promise<void>;

  protected abstract getBasePath(farmId: string, areaId: string): string;
}
