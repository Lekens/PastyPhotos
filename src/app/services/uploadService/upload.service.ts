import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Upload} from '../../models/upload';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath = '/pasty_photos_user_images';
  constructor() { }
  public uploadB64 (upload, dataObject: object, callback: any, index: string) {
    const storageRef = firebase.storage().ref();
    const itemForUpload = upload;
    const name = `image-${Math.round(Math.random() * 100)}.png`;
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
          // console.log('File available at', downloadURL);
          // upload success
          dataObject[index] = downloadURL;
          callback(dataObject);
        });
      }
    );
  }
  public uploadDefaults (upload, dataObject: object, callback: any, errorCallback: any, index: string) {
    const storageRef = firebase.storage().ref();
    const itemForUpload = JSON.parse(JSON.stringify(upload));
    const name = `image-${Math.round(Math.random() * 100)}.png`;
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
        dataObject[index] = upload;
        // console.log('Error here ', error);
        errorCallback(dataObject, index);
      },
      () => {
        // upload success
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          // console.log('URL ', downloadURL, index);
          dataObject[index] = downloadURL;
          callback(dataObject);
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

  public uploadMultiple(upload) {
    const itemForUpload = JSON.parse(JSON.stringify(upload));
    const name = `image-${Math.round(Math.random() * 100)}.png`;
    const uploadBase = itemForUpload.split(';base64,')[1];
    return new Promise( (resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`${this.basePath}/${name}`).putString(uploadBase, 'base64');
      uploadTask.on('state_changed',
        function progress(snapshot) {        },
        function error(err) {
          reject('');
        },
        function complete() {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }
}
