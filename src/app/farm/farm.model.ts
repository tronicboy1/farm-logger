import { Area } from "./area.model";

export type Farm = {
  name: string;
  createdAt: number;
  /** lat, long, alt */
  location?: [number, number, number | null];
  adminMembers: string[];
  owner: string;
  observerMembers: string[];
  photoURL?: string;
  areas: Record<string, Area>;
};

export type FarmWithId = Farm & { id: string };
