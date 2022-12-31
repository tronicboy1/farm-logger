import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
// import { getDatabase } from "firebase/database";
import { getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { firebaseConfig } from './config';
import { app } from './firebase';

export class Firebase {
  static get app() {
    return initializeApp(firebaseConfig);
  }

  static get auth() {
    return getAuth(this.app);
  }

  // not in use
  // static get db() {
  //   return getDatabase(this.app);
  // }

  static get firestore() {
    return getFirestore(app);
  }
}
