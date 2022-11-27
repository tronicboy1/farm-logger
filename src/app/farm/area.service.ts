import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";

@Injectable({
  providedIn: "root",
})
export class AreaService extends FirebaseFirestore {
  constructor() {
    super();
  }
}
