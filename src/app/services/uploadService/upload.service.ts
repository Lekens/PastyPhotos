import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Upload} from '../../models/upload';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath = '/pasty_photos_user_images';
  constructor() { }
  public uploadB64 (upload, dataObject: object, callback: any, key: string) {
    const storageRef = firebase.storage().ref();
    const itemForUpload = upload;
    const name = 'image' + Math.random() * 100;
    const uploadBase = itemForUpload.split(';base64,')[1];
    const uploadTask = storageRef.child(`${this.basePath}/${name}`).putString(uploadBase, 'base64');
    // split out the image/png or jpg out of string
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        // upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
          // upload success
          // upload.url = uploadTask.snapshot.downloadURL;
          dataObject[key] = downloadURL;
          // upload.url = downloadURL;
          callback(dataObject);
          // upload.name = upload.file.name;
        });
      }
    );
  }
  public uploadBlob (upload: Upload, dataObject: any, callback: any, index: number) {
    const storageRef = firebase.storage().ref();
    console.log('UPLOAD ', upload);
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
          // upload success
          dataObject[index] = downloadURL;
          upload.url = downloadURL;
          callback(dataObject);
          // upload.name = upload.file.name;
        });
      }
    );
  }
  public uploadMultiple(upload: Upload) {
    return new Promise( (resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
      uploadTask.on('state_changed',
        function progress(snapshot) {        },
        function error(err) {
        reject({});
        },
        function complete() {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            upload.url = downloadURL;
            resolve({name: upload.file.name, url: upload.url});
          });
        }
      );
    });
  }
}
