import {Component, OnInit } from '@angular/core';
import {CacheService} from '../../services/cacheService/cache.service';
import {environment as ENV} from '../../../environments/environment';
import {BootstrapNotifyService} from '../../services/bootstrap-notify/bootstrap-notify.service';
import {UtilService} from '../../services/utilService/util.service';
import {isNullOrUndefined} from 'util';
import {UploadService} from '../../services/uploadService/upload.service';
import {DeleteService} from '../../services/firebase-delete/delete.service';
import {Upload} from '../../models/upload';
import Croppie from 'croppie/croppie';
import * as moment from 'moment';
import {UserService} from '../../services/api-handlers/userService/user.service';
import {ActivatedRoute} from "@angular/router";
import {NavigatorService} from "../../services/navigatorService/navigator.service";
// import PaystackPop from '@paystack/inline-js/dist/inline.js';
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
  globalLoading = false;
  loaders = {
    loading: false,
    saving: false
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
  checkoutOrder = {
    full_name: null,
    phone_number: null,
    email: null,
    postal_code: null,
    country: 'Nigeria',
    address: null,
    city: null,
    state_province: null,
    frame_style: null,
    frame_color: null,
    matting: null,
    number_of_frames: 0,
    total_amount: 0.0,
    delivery_date: moment().add(3, 'days'), // .format('DD-MM-YYYY')
    extra_num: 0,
    extra_amount: 0.0,
    amount_for_three: 0.0,
    images: []
  };
  orderId = null;
  constructor(private cacheService: CacheService,
              private alertService: BootstrapNotifyService,
              private utilService: UtilService,
              private route: ActivatedRoute,
              private userService: UserService,
              private firebaseDelete: DeleteService,
              private navigateService: NavigatorService,
              private uploadService: UploadService) {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || null;
    if (this.orderId) {
      this.globalLoading = true;
      this.verifyOrderTransaction(this.orderId);
    } else {
      this.globalLoading = false;
      this.initFrame();
    }

  }

  ngOnInit() {  }
  initFrame() {
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
    }, 1000);
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
                      // url: 'https://i.imgur.com/xD9rzSt.jpg',
                      url: `${properties.image}`,
                      orientation: 1
});



}

  rotateRight() {
    this.vanilla.rotate(90);
  }

  rotateLeft() {
    this.vanilla.rotate(-90);
  }
  public cropImage() {
    this.loaders.loading = true;
    this.vanilla.result('canvas', 'original', 'png', 1).then((image) => {
      // console.log('FileList ', image, this.selectedTileImage);
      this.uploadService.uploadB64(image, JSON.parse(JSON.stringify(this.selectedTileImage.tileProp.tiles)), (dataObject) => {
        // console.log('Data ', dataObject);
        this.cacheService.deleteSession(ENV.SECRET_USER_KEY);
        this.loaders.loading = false;
        this.closeOverlay();
        this.vanilla.destroy();
        this.tiles[this.selectedTileImage.index] = dataObject[this.selectedTileImage.index];
        console.log('FRAME COLOR ', this.selectedTileImage.tileProp.color);
        setTimeout(() => {
          $(`.${this.selectedTileImage.tileProp.color}-frame`).removeClass('hidden');
          const type = this.selectedFrameStyle.mat;
          if (type) {
            $(`#preview-no-${this.selectedTileImage.index}`).addClass('matting');
          }
        }, 10);
        setTimeout(() => {
          this.updateCache(dataObject);
        }, 20);
      }, this.selectedTileImage.index);
    });
  }

  public uploadAllPhotos() {
    const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
    console.log('UserFrames', userFrames);
    userFrames.tiles.forEach((frame, index) => {
        if (!frame.includes('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images')) {
          console.log('Image is still in Local machine');
          this.uploadLocalImages(userFrames.tiles, frame, index);
        }
    });
    this.checkoutOrder.images = userFrames.tiles;
    this.checkoutOrder.frame_color = userFrames.color;
    this.checkoutOrder.frame_style = userFrames.style;
    this.checkoutOrder.number_of_frames = this.checkoutOrder.images.length;
    this.checkoutOrder.total_amount = 15000 + (4000 * (this.checkoutOrder.number_of_frames - 3));
    this.checkoutOrder.extra_num = this.checkoutOrder.number_of_frames - 3;
    this.checkoutOrder.extra_amount = 4000 * (this.checkoutOrder.extra_num);
    this.checkoutOrder.amount_for_three = 5000 * 3;
  }
  uploadLocalImages(userFrames, image, index) {
    this.uploadService.uploadDefaults(image, userFrames, (dataObject) => {
      // console.log('Data ', dataObject, index, image);
      setTimeout(() => {
        this.updateCache(dataObject);
      }, 20);
    }, (data, i) => {
      this.alertService.error('Unable to upload photo on frame ' + (i + 1));
    }, index);
  }
  public checkoutCart() {
    this.openOverlay('checkout-overlay');
    this.uploadAllPhotos();
  }
  public checkOutOrder() {
    this.loaders.saving = true;
    const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
    console.log('ORDER ', this.checkoutOrder);
    console.log('FRAMES ', userFrames);
    if (this.checkoutOrder.images.length < userFrames.tiles.length ) {
      this.uploadAllPhotos();
      this.endAction();
    }

    if (!this.checkoutOrder.full_name) {
      this.alertService.error('Full name is required');
      this.endAction();
    } else if (!this.checkoutOrder.phone_number) {
      this.alertService.error('Phone number is required');
      this.endAction();
    } else if (!this.checkoutOrder.email) {
      this.alertService.error('Email is required');
      this.endAction();
    } else if (this.checkoutOrder.email && !this.checkoutOrder.email.match(ENV.EMAIL_VALIDATION)) {
      this.alertService.error('Invalid email address');
      this.endAction();
    } else if (!this.checkoutOrder.postal_code) {
      this.alertService.error('Postal code is required');
      this.endAction();
    } else if (!this.checkoutOrder.address) {
      this.alertService.error('Address is required');
      this.endAction();
    } else if (!this.checkoutOrder.city) {
      this.alertService.error('City is required');
      this.endAction();
    } else if (!this.checkoutOrder.state_province) {
      this.alertService.error('State/Province is required');
      this.endAction();
    } else if (!this.checkoutOrder.country) {
      this.alertService.error('Country is required');
      this.endAction();
    } else {
      let invalid = true;
      for (let i = 0; i < this.checkoutOrder.images.length; i++) {
        const frame = this.checkoutOrder.images[i];
        if (!frame.includes('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images')) {
          console.log('Image is still in Local machine');
          invalid = false;
          this.alertService.error('Some images are still being processed, cannot proceed with payment!');
          this.closeOverlay();
          this.uploadLocalImages(this.checkoutOrder.images, frame, i);
          this.endAction();
          break;
        }
      }
      if (invalid) {
        this.proceedToCheckoutPayment();
      }
    }
   }
   public endAction() {
    this.loaders.saving = false;
    return;
   }
   public proceedToCheckoutPayment() {
    console.log('CheckoutDetail ', this.checkoutOrder);
    this.userService.checkout(this.checkoutOrder).subscribe((response: any) => {
      console.log('Payment response ', response);
      this.loaders.saving = false;
      this.closeOverlay();
      this.alertService.success(response.msg || 'Order saved successfully!, redirecting to payment');
      // window.open();
      window.location.assign(response.data.authorization_url);
    }, error => {
      this.loaders.saving = false;
      this.alertService.error(error.error.msg || 'Unable to process your transaction, please try again!');
    });
   }
   public verifyOrderTransaction(orderId) {
    this.globalLoading = true;
     this.userService.verifyPayment({orderId}).subscribe((response: any) => {
       console.log('Payment response ', response);
       this.globalLoading = false;
       this.closeOverlay();
       this.cacheService.deleteStorage(ENV.SECRET_USER_KEY);
       this.selectedFrameStyle = {
         style: null,
         mat: null,
         color: 'black',
         tiles: []
       };
       this.updateCache(this.selectedFrameStyle.tiles);
       this.navigateService.navigateUrl('/');
       this.alertService.success(response.msg || 'Payment confirmed, thank you.');
     }, error => {
       this.globalLoading = false;
       this.alertService.error(error.error.msg || 'Confirm payment for this order!');
     });
   }
}
