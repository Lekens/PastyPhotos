import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  private basePath = '/pasty_photos_user_images';
  constructor() { }
  public deleteImages(file) {
    const storageRef = firebase.storage().ref();
    const deleteTask = storageRef.child(`pasty_photos_user_images/${file}`);
    deleteTask.delete().then(() => { }).catch(() => { });
  }
}
