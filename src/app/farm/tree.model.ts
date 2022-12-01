export type CoffeeTree = {
  regularId: number;
  location?: [number, number];
  reports: Record<string, CoffeeTreeReport>;
};

export type CoffeeTreeReport = {
  photoURL: string;
  createdAt: number;
  notes: string;
  weather?: {
    description: string;
    tempHigh: number;
    tempLow: number;
    humidity: number;
  };
};

export type CoffeeTreeWithId = { id: string } & CoffeeTree;
