import { Injectable } from "@angular/core";
import { FarmModule } from "../farm.module";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@custom-firebase/firebase";

@Injectable({
  providedIn: FarmModule,
})
export class PhotoService {
  constructor() {}

  public uploadPhoto(file: File, path: string) {
    const storage = getStorage(app);
    const ref = storageRef(storage, path);
    return uploadBytes(ref, file).then((snapshot) => getDownloadURL(snapshot.ref));
  }
}
