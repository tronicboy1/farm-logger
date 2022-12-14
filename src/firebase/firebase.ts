// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { environment } from '../environments/environment';
import { firebaseConfig } from './config';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let analytics: Analytics;

if (!environment.production) {
  const firestore = getFirestore(app);
  connectFirestoreEmulator(firestore, 'localhost', environment.emulatorPorts.firestore);
  const db = getDatabase(app);
  connectDatabaseEmulator(
    db,
    'localhost',
    environment.emulatorPorts.database, // ここはfirebase.jsonに入っている設定に合わせましょう！
  );
  const storage = getStorage(app);
  connectStorageEmulator(storage, 'localhost', environment.emulatorPorts.storage);
}

if (environment.production) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6Lffd0wjAAAAAN7ghKd7xyOOyqcmthVEOecCx_g5'),
    isTokenAutoRefreshEnabled: true,
  });
  analytics = getAnalytics(app);
}
