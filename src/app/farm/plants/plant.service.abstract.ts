import { Observable } from 'rxjs';
import { Plant, PlantWithId } from './plant.model';

export abstract class PlantService {
  static limit: number;

  abstract getPlant(farmId: string, areaId: string, treeId: string): Observable<Plant>;

  abstract watchPlant(farmId: string, areaId: string, treeId: string): Observable<Plant>;

  /**
   * Returns an observable with pagination functions
   */
  abstract watchPlants(farmId: string, areaId: string): Observable<PlantWithId[]>;
  abstract triggerNextPage(): void;
  abstract clearPaginationCache(): void;
  abstract setSearch(searchId: string): void;

  abstract create(farmId: string, areaId: string, data: Plant): Promise<any>;

  abstract regularIdIsUnique(farmId: string, areaId: string, regularId: number): Observable<boolean>;

  abstract update(farmId: string, areaId: string, treeId: string, areaData: Partial<Plant>): Promise<void>;
}
