import { PlantFactory } from './plant.factory';

describe('PlantFactory', () => {
  it('should create an instance', () => {
    expect(new PlantFactory()).toBeTruthy();
  });
});
