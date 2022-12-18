import { Injectable } from '@angular/core';
import { FarmModule } from '../farm.module';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '@custom-firebase/firebase';

@Injectable({
  providedIn: FarmModule,
})
export class PhotoService {
  static defaultFileEnd = 'img.png';
  constructor() {}

  public uploadPhoto(file: File, path: string) {
    return uploadBytes(this.getRef(path), file).then((snapshot) => getDownloadURL(snapshot.ref));
  }

  public deletePhoto(path: string) {
    return deleteObject(this.getRef(path));
  }

  private getRef(path: string) {
    const storage = getStorage(app);
    return storageRef(storage, path);
  }

  static compressPhoto(file: File): Promise<File> {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      const src = URL.createObjectURL(file);
      image.src = src;
      image.addEventListener('load', () => resolve(image), { once: true });
    })
      .then(
        (image) =>
          new Promise<File>((resolve) => {
            const { naturalHeight, naturalWidth } = image;
            const canvas = document.createElement('canvas');
            const compress = Math.max(naturalHeight, naturalWidth) > 400;
            const widthCompressionRatio = 400 / naturalHeight;
            const compressedWidth = Math.floor(widthCompressionRatio * naturalWidth);
            canvas.width = compress ? compressedWidth : naturalWidth;
            canvas.height = compress ? 400 : naturalHeight;
            const context = canvas.getContext('2d');
            if (!context) throw Error('Unable to load context.');
            const { width, height } = canvas;
            context!.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, naturalWidth, naturalHeight, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (!blob) throw Error('No blob was generated');
              const file = new File([blob], this.defaultFileEnd, { lastModified: Date.now() });
              const transfer = new DataTransfer();
              transfer.items.add(file);
              resolve(transfer.files[0]);
            });
          }),
      )
      .catch(() => file);
  }
}
