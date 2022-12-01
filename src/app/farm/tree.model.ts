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
  beanYield: string;
};

export type CoffeeTreeReportWithId = CoffeeTreeReport & { id: string };

export type CoffeeTreeWithId = { id: string } & CoffeeTree;
