export type CoffeeTree = {
  regularId: number;
  species: string;
  startHeight: number;
  location?: [number, number, number | null];
};

export type CoffeeTreeReport = {
  photoURL?: string;
  photoPath?: string;
  createdAt: number;
  notes: string;
  height: number;
  budding: string;
  beanYield: string;
};

export type CoffeeTreeReportWithId = CoffeeTreeReport & { id: string };

export type CoffeeTreeWithId = { id: string } & CoffeeTree;
