import { Area } from './area.model';
import { EnvironmentRecord } from './environment-record.service';

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
  environmentRecords: Record<string, EnvironmentRecord>;
};

export type FarmWithId = Farm & { id: string };
