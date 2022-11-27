import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";
import { FarmModule } from "./farm.module";

@Injectable({
  providedIn: FarmModule,
})
export class TreeService extends FirebaseFirestore {
  constructor() {
    super();
  }
}
