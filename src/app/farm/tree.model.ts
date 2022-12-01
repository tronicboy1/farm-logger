export type CoffeeTree = {
  regularId: number;
  species: string;
  startHeight: number;
  location?: [number, number];
  reports: Record<string, CoffeeTreeReport>;
};

export type CoffeeTreeReport = {
  photoURL?: string;
  createdAt: number;
  notes: string;
  height: number;
  budding: string;
};

export type CoffeeTreeWithId = { id: string } & CoffeeTree;
