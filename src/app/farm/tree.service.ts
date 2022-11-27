import { Injectable } from "@angular/core";
import { FirebaseFirestore } from "@custom-firebase/inheritables/firestore";

@Injectable({
  providedIn: "root",
})
export class TreeService extends FirebaseFirestore {
  constructor() {
    super();
  }
}
