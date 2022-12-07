import { app } from "@custom-firebase/firebase";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { environment } from "src/environments/environment";

export class FirebaseAuth {
  protected get auth() {
    return getAuth(app);
  }

  constructor() {
    if (!environment.production) {
      connectAuthEmulator(this.auth, `http://localhost:${environment.emulatorPorts.auth}`);
    }
  }
}
