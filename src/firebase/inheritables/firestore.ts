import { app } from "@custom-firebase/firebase";
import { getFirestore } from "firebase/firestore";

export class FirebaseFirestore {
  protected get firestore() {
    return getFirestore(app);
  }
  protected db = this.firestore;
}
