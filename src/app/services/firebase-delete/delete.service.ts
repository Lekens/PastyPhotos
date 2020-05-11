import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  private basePath = '/letsfarm_images';
  constructor() { }
  public deleteImages(file) {
    const storageRef = firebase.storage().ref();
    const deleteTask = storageRef.child(`letsfarm_images/${file}`);
    deleteTask.delete().then(() => { }).catch(() => { });
  }
}
