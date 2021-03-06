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
import {ActivatedRoute} from '@angular/router';
import {NavigatorService} from '../../services/navigatorService/navigator.service';
import {NotificationService} from '../../services/notificationServices/notification.service';

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
    tiles: [],
    dimensions: []
  };
  percentageDone = 0;
  triggerHolder = false;
  globalLoading = false;
  loaders = {
    loading: false,
    saving: false,
    checking: false
  };
  uploadImageToggle = true;
  vanilla: any;
  index = null;
  public tiles: any[] = [];
  public imagesUploaded: any[] = [];
  public dimensionTiles: any[] = [];
  height = 0;
  width = 0;
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
              private alertService: NotificationService,
              // private notifyService: NotificationService,
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
        this.dimensionTiles = userFrames.dimensions;
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
    if (this.loaders.checking) {
      this.alertService.info('Upload in progress, please wait');
      return false;
    }
    this.selectedTileImage = { image , index, tileProp: this.selectedFrameStyle};
    const originalCopy = JSON.parse(localStorage.getItem('originalCopies')) || [];
    console.log('originalCopy.indexOf(image) ', originalCopy.indexOf(image));
    if (originalCopy.indexOf(image) > -1 || originalCopy[index] ) {    } else {
      originalCopy[index] = image;
      localStorage.setItem('originalCopies', JSON.stringify(originalCopy));
    }
    console.log('Image for editing ', image, index);
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
    const originalCopies = JSON.parse(localStorage.getItem('originalCopies')) || [];
    console.log('Image ', image.image, image.index, index, originalCopies);
    originalCopies.splice(index, 1);
    this.tiles.splice(index, 1);
    this.dimensionTiles.splice(index, 1);
    this.selectedFrameStyle.tiles = this.tiles;
    this.selectedFrameStyle.dimensions = this.dimensionTiles;
    localStorage.setItem('originalCopies', JSON.stringify(originalCopies));
    this.updateCache(this.selectedFrameStyle.tiles, this.selectedFrameStyle.dimensions);
    this.closeOverlay();
    if (image.image.includes('https://firebasestorage.googleapis.com')) {
      const imageName = image.image
        .split('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images%2F')[1];
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
    this.updateCache(this.tiles, this.dimensionTiles);
  }
  public updateCache(tiles, dimensions = this.dimensionTiles) {
    if (tiles.length) {
      this.selectedFrameStyle.tiles = tiles;
      this.selectedFrameStyle.dimensions = dimensions;
      this.cacheService.setStorage(ENV.SECRET_USER_KEY, JSON.stringify(this.selectedFrameStyle));
      // this.cacheService.setStorage('dimensions', JSON.stringify(this.dimensionTiles));
    } else {
      this.cacheService.deleteStorage(ENV.SECRET_USER_KEY);
      // this.cacheService.deleteStorage('dimensions');
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
      // this.updateCache(this.tiles, this.dimensionTiles);
    }, 1000);
  }
  public triggerUploader() {
    this.uploadImageToggle = true;
    setTimeout(() => {
      $('#fileUploader').trigger('click');
    }, 10);
  }
  public validateImage(event) {
    this.imagesUploaded = event.target.files;
    console.log('LENGHT ', this.imagesUploaded);
    this.uploadImageToggle = false;
    this.loaders.checking = true;
    this.uploadImageRecursive(this.imagesUploaded, 0);
  }
  public proceedToUpload() {
    console.log('Done with file uploads');
    // old approach
    // this.uploadImageToggle = false;
    // this.loaders.checking = true;

    // new approach
    this.uploadImageToggle = true;
    this.loaders.checking = false;


    // this.triggerHolder = true;
    // this.assureUploaded(0, [], this.triggerHolder); // start processing uploads
  }
  public uploadImageRecursive(images, index = this.index) {
    const image =  event =  images[index];
    console.log('Image 999999999999999999', image, event, this.imagesUploaded.length === index, this.imagesUploaded.length,  index);
    if (this.imagesUploaded.length === index ) {
      // done with upload
      this.proceedToUpload();
      return false;
    } else if (image && image.type && !image.type.includes('image/')) {
      this.alertService.error('Invalid upload file, please try uploading a valid image!');
      return false;
    } else {
       this.processImage(event, index);
    }
  }
  public processSelectedFile(event, items, width, height, index) {
    const reader = new FileReader();
    const file = event; // .target.files[0];
    if (!isNullOrUndefined(file)) {
      reader.onloadend = () => {
        items.push(reader.result);
        console.log('ITEMs ', items);

        const width_ = parseInt(width, 10);
        const height_ = parseInt(height, 10);
        this.dimensionTiles.push(height_ > width_ ? 'a' : 'b');
        this.triggerHolder = true;
        this.updateTiles();
        this.assureUploaded(index, items, (keeper, original) => {
          this.updateCache(keeper, this.dimensionTiles);
          localStorage.setItem('originalCopies', JSON.stringify(original));
          this.uploadImageRecursive(this.imagesUploaded, index + 1);
          this.percentageDone = 0;
        }, this.triggerHolder); // start processing uploads
      };
      reader.readAsDataURL(file);
      // this.updateTiles();
    }
  }

   processImage(event, index) {
     this.utilService.validateImage(event, 400, 400,
      (width, height) => {
        // this.dimensionTiles = dimension;
        this.width = width;
        this.height = height;
         this.decideToUseBadImage(event, this.tiles, index);
        // this.uploadImageToggle = false;
      }, (width, height) => {
        // this.dimensionTiles = dimension;
        this.width = width;
        this.height = height;
        this.processSelectedFile(event, this.tiles, this.width, this.height, index);
        // this.uploadImageToggle = false;
      });
    return true;
  }
  public decideToUseBadImage(event, item, index) {
    console.log('Hello world ', event, item);
    const reader = new FileReader();
    const file = event; // .target.files[0];
    if (!isNullOrUndefined(file)) {
      reader.onloadend = () => {
        this.badImage = reader.result;
        this.keepEvent = event;
        this.index = index;
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
    console.log('Indexer ', this.index);
    this.uploadImageRecursive(this.imagesUploaded, this.index + 1);
    this.index = null;
  }
  public keepBadImage() {
    this.closeOverlay();
    this.processSelectedFile(this.keepEvent, this.tiles, this.width, this.height, this.index);
    this.index = null;
  }
  public uploadImageFireBase(event, item, index, looper) {
    // let bucket: FileList;
    // let itemForUpload;
    // bucket = event.target.files;
    // itemForUpload  = bucket.item(0);
    // console.log('itemForUpload' , itemForUpload);
    this.uploadImageRecursive(this.imagesUploaded, looper + 1);
    /* this.uploadService.uploadBlob(new Upload(event), JSON.parse(JSON.stringify(item)), async (dataObject) => {
      // this.tiles = dataObject;
      console.log('Data ', dataObject);
      this.cacheService.deleteSession(ENV.SECRET_USER_KEY);
      setTimeout(() => {
        this.updateCache(dataObject);
      }, 20);
      // this.updateTiles();
    }, index);*/
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
    // let boundary = { width: '230px', height: '253px' };
    /*if (properties.tileProp.mat === 'matting') {
      boundary = { width: '210px', height: '220px' };
    }*/
    let imageToUse = properties.image;
    console.log('INIT RENDER ', imageToUse);

    setTimeout(() => {
     const originalCopy = JSON.parse(localStorage.getItem('originalCopies')) || [];
     console.log('originalCopy.indexOf(image) ', originalCopy.indexOf(properties.image));
     if (originalCopy.indexOf(properties.image) > -1 ) {
       imageToUse = properties.image;
     } else {
       imageToUse = originalCopy[properties.index];
     }
     console.log('RENDER ', imageToUse);
      this.vanilla.bind({
        url: imageToUse,
        orientation: 1
      });
   }, 2000);

    $('.my-croppie').on('update.croppie', function(ev, cropData) {
      console.log('DRAG EVENT OCCURRED ', ev, cropData);
    });

  const el = document.getElementById('cropperNow');
  const Options = {
    // enableExif: true,
    viewport: { width: '250px', height: '250px'},
    boundary: { width: '250px', height: '250px' },
    showZoomer: false,
    enableOrientation: true,
    enableResize: false,
    enableZoom: true,
    mouseWheelZoom: 'ctrl',
    enforceBoundary: true
  };
    this.vanilla = new Croppie(el, Options);
    setTimeout(() => {
      $('.cr-viewport').addClass('cr-viewport-' + properties.tileProp.color.toLowerCase());
    }, 500);
  this.vanilla.bind({
                      // url: 'https://i.imgur.com/xD9rzSt.jpg',
                      url: imageToUse,
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
        this.dimensionTiles[this.selectedTileImage.index] = 'b';
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

  public uploadAllPhotos(keepers = []) {
    const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
    console.log('UserFrames', userFrames);
    userFrames.tiles.forEach((frame, index) => {
        if (!frame.includes('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images')) {
          console.log('Image is still in Local machine');
          this.uploadLocalImages(userFrames.tiles, frame, index);
        }
    });
    if (userFrames.tiles.length > 3) {
      this.checkoutOrder.total_amount = (15000 + (4000 * (userFrames.tiles.length - 3)));
    } else if (userFrames.tiles.length === 3) {
      this.checkoutOrder.total_amount = 15000;
    } else {
      this.alertService.error('you cannot order for less than 3 frames!');
      return false;
    }
    this.checkoutOrder.images = userFrames.tiles;
    this.checkoutOrder.frame_color = userFrames.color;
    this.checkoutOrder.frame_style = userFrames.style;
    this.checkoutOrder.number_of_frames = userFrames.tiles.length;
    this.checkoutOrder.extra_num = userFrames.tiles.length - 3;
    this.checkoutOrder.extra_amount = 4000 * (userFrames.tiles.length - 3);
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
    this.loaders.checking = true;
    this.triggerHolder = false;
    this.uploadImageToggle = true;
    // const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
    this.assureUploadedAgain(0, []);
  }
  public imageUrlReplacer(oldImages, newImages) {
    for (let i = 0; i < oldImages.length; i++) {
      if (oldImages[i].includes('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images')) {
        // do not replace the image;
      } else {
        oldImages[i] = newImages[i];
      }
    }
    this.selectedFrameStyle.tiles = oldImages;
    this.updateCache(this.selectedFrameStyle.tiles);
  }
  proceedToCheckoutNow(keeper, trigger) {
    console.log('TRIGGER -============== ', trigger);
    const userFrameTiles = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));

    if (trigger) {
      if (keeper.length) {
        this.loaders.checking = false;
        // const userFrameTiles = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
        this.imageUrlReplacer(userFrameTiles.tiles, keeper);
      }
      this.triggerHolder = false;
      return false;
    }

    if (keeper.length) {
      this.imageUrlReplacer(userFrameTiles.tiles, keeper);
      if (userFrameTiles.tiles && userFrameTiles.tiles.length < 3) {
        this.loaders.checking = false;
        return this.alertService.error('Upload at least three images to proceed.');
      } else {
        this.uploadAllPhotos(keeper);
        this.loaders.checking = false;
        this.openOverlay('checkout-overlay');
      }
    }
  }

  public assureUploaded(index, events, cb, trigger = this.triggerHolder) {
    const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY)) || {tiles: []};
    const original = JSON.parse(this.cacheService.getStorage('originalCopies')) || [];
    const keeper = userFrames.tiles || [];
    this.percentageDone = 0;
    this.uploadService.uploadMultiple(events[index], this.percentageDone).then(success => {
      // console.log('Sus ', success, index, this.proof.rawImage.length);
      keeper.push(success);
      original.push(success);
      // const next = index + 1;
      // console.log('NEXt SUS', next, this.proof.rawImage[next]);
      // this.assureUploaded(next, keeper);
      cb(keeper, original);
    }).catch(err => {
      console.log('Error ', err, index);
      keeper.push(events[index]);
      original.push(events[index]);
      cb(keeper, original);
      // const next = index + 1;
      // console.log('NEXt ', next, this.proof.rawImage[next]);
      // this.assureUploaded(next, keeper);
    });

    // const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
    // if (!userFrames) { return false; }
    // const images = userFrames.tiles;
    // console.log('INDEXER ', images.length, index, images.length === index);
   /* if (images.length === index ) {
      // done with upload
      this.proceedToCheckoutNow(keeper, trigger);
      return false;
    }*/
    /*if (images[index].includes('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images')) {
      keeper.push(images[index]);
      // const next = index + 1;
      cb(keeper);
      // this.assureUploaded(next, keeper);
    }*/
    /*else {
      this.uploadService.uploadMultiple(images[index]).then(success => {
        // console.log('Sus ', success, index, this.proof.rawImage.length);
        keeper.push(success);
        // const next = index + 1;
        // console.log('NEXt SUS', next, this.proof.rawImage[next]);
        // this.assureUploaded(next, keeper);
        cb(keeper);
      }).catch(err => {
        console.log('Error ', err, index);
        keeper.push(images[index]);
        cb(keeper);
        // const next = index + 1;
        // console.log('NEXt ', next, this.proof.rawImage[next]);
        // this.assureUploaded(next, keeper);
      });
    }*/
  }








  public assureUploadedAgain(index, keeper, trigger = this.triggerHolder) {
    const userFrames = JSON.parse(this.cacheService.getStorage(ENV.SECRET_USER_KEY));
    if (!userFrames) { return false; }
    const images = userFrames.tiles;
    console.log('INDEXER ', images.length, index, images.length === index);
    if (images.length === index ) {
      // done with upload
      this.proceedToCheckoutNow(keeper, trigger);
      return false;
    }
    if (images[index].includes('https://firebasestorage.googleapis.com/v0/b/pastyphotos.appspot.com/o/pasty_photos_user_images')) {
      keeper.push(images[index]);
      const next = index + 1;
      this.assureUploadedAgain(next, keeper);
    } else {
      this.uploadService.uploadMultiple(images[index], this.percentageDone).then(success => {
        // console.log('Sus ', success, index, this.proof.rawImage.length);
        keeper.push(success);
        const next = index + 1;
        // console.log('NEXt SUS', next, this.proof.rawImage[next]);
        this.assureUploadedAgain(next, keeper);
      }).catch(err => {
        console.log('Error ', err, index);
        // keeper.push({});
        const next = index + 1;
        // console.log('NEXt ', next, this.proof.rawImage[next]);
        this.assureUploadedAgain(next, keeper);
      });
    }
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
         tiles: [],
         dimensions: []
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
