import { Area } from "./area.model";

export type Farm = {
  name: string;
  createdAt: number;
  location?: [number, number];
  adminMembers: string[];
  observerMembers: string[];
  photoURL?: string;
  areas: Record<string, Area>;
};

export type FarmWithId = Farm & { id: string };
