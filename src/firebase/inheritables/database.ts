import { firebaseConfig } from "@custom-firebase/config";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export class FirebaseDatabase {
  /** Must reinit app for service worker. */
  protected get app() {
    return initializeApp(firebaseConfig);
  }
  protected get db() {
    return getDatabase(this.app);
  }
}
