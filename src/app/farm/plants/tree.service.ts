import { Injectable } from '@angular/core';
import { PlantService } from './plant.service';
import { CoffeeTree } from './tree.model';

@Injectable({
  providedIn: 'root',
})
export class TreeService extends PlantService<CoffeeTree> {
  public getTree(farmId: string, areaId: string, treeId: string) {
    return super.getPlant(farmId, areaId, treeId);
  }

  public watchTree(farmId: string, areaId: string, treeId: string) {
    return super.watchPlant(farmId, areaId, treeId);
  }

  public watchTrees(farmId: string, areaId: string) {
    return super.watchAll(farmId, areaId);
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
