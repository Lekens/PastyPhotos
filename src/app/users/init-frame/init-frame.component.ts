import {Component, OnInit, ViewChild} from '@angular/core';
import {CacheService} from '../../services/cacheService/cache.service';
import {environment as ENV} from '../../../environments/environment';
import {BootstrapNotifyService} from '../../services/bootstrap-notify/bootstrap-notify.service';
import {UtilService} from '../../services/utilService/util.service';
import {isNullOrUndefined} from 'util';
import {UploadService} from '../../services/uploadService/upload.service';
import {DeleteService} from '../../services/firebase-delete/delete.service';
import {Upload} from '../../models/upload';
import Croppie from 'croppie/croppie';
// import * as Croppie from 'croppie';
// import { Croppie } from 'croppie/croppie';
import { DomSanitizer } from '@angular/platform-browser';
import { CropperComponent } from 'angular-cropperjs';

@Component({
  selector: 'app-init-frame',
  templateUrl: './init-frame.component.html',
  styleUrls: ['./init-frame.component.css']
})
export class InitFrameComponent implements OnInit {
  // @ViewChild('angularCropper') public angularCropper: CropperComponent;
  selectedFrameStyle = {
    style: null,
    mat: null,
    color: 'black',
    tiles: []
  };
  loaders = {
    loading: false
  };
  uploadImageToggle = true;
  vanilla: any;
  public tiles: any[] = [];
  public view = {
    showActions: true,
    adjustView: false,
    badImage: false
  };
  badImage = null;
  keepEvent = null;
  selectedTileImage = {image : null, index: null, tileProp: null};

  constructor(private cacheService: CacheService,
              private alertService: BootstrapNotifyService,
              private utilService: UtilService,
              private sanitizer: DomSanitizer,
              private firebaseDelete: DeleteService,
              private uploadService: UploadService) {}

  ngOnInit() {
    setTimeout(() => {
      const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
      if (userFrames && userFrames.style) {
        // TODO: PLEASE USE COOKIES INSTEAD or BOTH
        console.log('EXECUTE THE CALL BACK', userFrames);
        this.selectedFrameStyle = userFrames;
        this.tiles = userFrames.tiles;
        this.frameStyle(userFrames.style, userFrames.color, userFrames.mat ? 'matting' : '');
      } else {
        this.frameStyle('classic', 'black', 'matting');
      }
    }, 2000);
  }
  goBack() {
    window.history.back();
  }

  openOverlay(id) {
    $(`#${id}`).removeClass('d-none');
    // document.getElementById('checkout-overlay').style.display = 'block';
    document.getElementById('top').style.overflow = 'hidden';
  }
  closeOverlay() {
    $('.pasty-overlay').addClass('d-none');
    // document.getElementById('checkout-overlay').style.display = 'none';
    document.getElementById('top').style.overflow = 'auto';
  }
  checkoutCart() {
    this.openOverlay('checkout-overlay');
  }
  public popupPresentation(image, index, view) {
    this.selectedTileImage = { image , index, tileProp: this.selectedFrameStyle};
    this.openOverlay('adjust-overlay');
    this.initView();
    this.view[view] = true;
    if (view === 'adjustView') {
      setTimeout(() => {
        this.initialCropper(this.selectedTileImage);
      }, 1000);
    }
  }
  initView() {
    this.view = {
      showActions: false,
      adjustView: false,
      badImage: false
    };
  }
  deleteItem(image) {
    const index = this.tiles.indexOf(image.image);
    console.log('Image ', image.image, image.index, index);
    this.tiles.splice(index, 1);
    this.selectedFrameStyle.tiles = this.tiles;
    this.updateCache(this.selectedFrameStyle.tiles);
    this.closeOverlay();
    if (image.image.includes('https://firebasestorage.googleapis.com')) {
      const imageName = image.split('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images%2F')[1];
      const imageSplitted = imageName.split('?alt=');
      console.log('Image ', imageSplitted);
      this.firebaseDelete.deleteImages(imageSplitted[0]);
    }
  }

  public frameStyle(id, color, type) {
    $('.filter-button').removeClass('selected');
    $(`#${id}`).addClass('selected');
    this.selectedFrameStyle.style = id;
    this.selectedFrameStyle.color = color;
    this.selectedFrameStyle.mat = type;
    this.updateTiles();
    console.log('Update Rendering');
    this.updateCache(this.tiles);
  }
  public updateCache(tiles) {
    if (tiles.length) {
      this.selectedFrameStyle.tiles = tiles;
      this.cacheService.setStorage(ENV.SECRET_USER_KEY, JSON.stringify(this.selectedFrameStyle));
    } else {
      this.cacheService.deleteStorage(ENV.SECRET_USER_KEY);
    }
  }
  public updateTiles() {
    console.log('Selected ', this.selectedFrameStyle);
    const type = this.selectedFrameStyle.mat;
    const color = this.selectedFrameStyle.color;
    setTimeout(() => {
      console.log('Selected ', type, color);
      $('.frame-svg').addClass('hidden');
      $(`.${color}-frame`).removeClass('hidden');
      $('.preview-tile').removeClass('matting');
      if (type) {
        $('.preview-tile').addClass('matting');
      }
      this.updateCache(this.tiles);
    }, 1000);
  }
  public triggerUploader() {
    this.uploadImageToggle = true;
    setTimeout(() => {
      $('#fileUploader').trigger('click');
    }, 10);
  }
  public validateImage(event) {
    const image = event.target.files[0];
    console.log('Image ', image, event);
    if (!image.type.includes('image/')) {
      this.alertService.error('Invalid upload file, please try uploading a valid image!');
      return false;
    } else {
      this.utilService.validateImage(event, 400, 400,
        () => {
        this.decideToUseBadImage(event, this.tiles);
          this.uploadImageToggle = false;
        }, () => {
        this.processSelectedFile(event, this.tiles);
          this.uploadImageToggle = false;
        });
      return true;
    }
  }
  public decideToUseBadImage(event, item) {
    console.log('Hello world ', event, item);
    const reader = new FileReader();
    const file = event.target.files[0];
    if (!isNullOrUndefined(file)) {
      reader.onloadend = () => {
        this.badImage = reader.result;
        this.keepEvent = event;
      };
      reader.readAsDataURL(file);
    }
      this.initView();
      this.view.badImage = true;
      this.openOverlay('adjust-overlay');
  }
  public removeBadImage() {
    this.initView();
    this.closeOverlay();
    this.badImage = null;
    this.keepEvent = null;
  }
  public keepBadImage() {
    this.closeOverlay();
    this.processSelectedFile(this.keepEvent, this.tiles);
  }
  public processSelectedFile(event, item) {
    const reader = new FileReader();
    const file = event.target.files[0];
    if (!isNullOrUndefined(file)) {
      reader.onloadend = () => {
        item.push(reader.result);
        console.log('ITEMs ', item);
        this.updateTiles();
        this.uploadImageFirebase(event, item, (item.length - 1));
      };
      reader.readAsDataURL(file);
      // this.updateTiles();
    }
  }
  public uploadImageFirebase(event, item, index) {
    let bucket: FileList;
    let itemForUpload;
    bucket = event.target.files;
    itemForUpload  = bucket.item(0);
    console.log('itemForUpload' , itemForUpload);
    this.uploadService.uploadBlob(new Upload(itemForUpload), JSON.parse(JSON.stringify(item)), (dataObject) => {
      // this.tiles = dataObject;
      console.log('Data ', dataObject);
      this.cacheService.deleteSession(ENV.SECRET_USER_KEY);
      setTimeout(() => {
        this.updateCache(dataObject);
      }, 20);
      // this.updateTiles();
    }, index);
  }
  public initialCropper(properties) {
    console.log('URL ', properties);
    let boundary = { width: '230px', height: '253px' };
    if (properties.tileProp.mat === 'matting') {
      boundary = { width: '210px', height: '220px' };
    }
  const el = document.getElementById('cropperNow');
  const Options = {
    // enableExif: true,
    viewport: { width: '230px', height: '253px'},
    boundary: boundary,
    showZoomer: false,
    enableOrientation: true,
    enableResize: false,
    enableZoom: true,
    mouseWheelZoom: 'ctrl',
    enforceBoundary: true
  };
  this.vanilla = new Croppie(el, Options);
  this.vanilla.bind({
                      url: 'https://i.imgur.com/xD9rzSt.jpg',
                      orientation: 1
});



}

  rotateRight() {
    this.vanilla.rotate(90);
  }

  rotateLeft() {
    this.vanilla.rotate(-90);
  }
}
