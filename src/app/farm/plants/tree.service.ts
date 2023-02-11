import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlantServiceInheritable } from './plant.service.inheritable';
import { CoffeeTree, CoffeeTreeWithId } from './tree.model';

@Injectable({
  providedIn: 'root',
})
export class TreeService extends PlantServiceInheritable {
  public getTree(farmId: string, areaId: string, treeId: string): Observable<CoffeeTree> {
    return super.getPlant(farmId, areaId, treeId);
  }

  public watchTree(farmId: string, areaId: string, treeId: string): Observable<CoffeeTree> {
    return super.watchPlant(farmId, areaId, treeId);
  }

  public watchTrees(farmId: string, areaId: string): Observable<CoffeeTreeWithId[]> {
    return super.watchPlants(farmId, areaId);
  }

  public createTree(farmId: string, areaId: string, treeData: CoffeeTree) {
    return super.create(farmId, areaId, treeData);
  }

  public treeRegularIdIsUnique(farmId: string, areaId: string, regularId: number) {
    return super.regularIdIsUnique(farmId, areaId, regularId);
  }

  public updateTree(farmId: string, areaId: string, treeId: string, data: Partial<CoffeeTree>) {
    return super.update(farmId, areaId, treeId, data);
  }
}
