import { Injectable } from '@angular/core';
import * as JWT_DECODE from 'jwt-decode';
import {CacheService} from '../cacheService/cache.service';
import {environment as ENV} from '../../../environments/environment';
import {IResponse} from '../../interfaces/iresponse';
import swal from 'sweetalert2';
import {EventsService} from '../eventServices/event.service';
import {ScrollToConfigOptions, ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  dataTableInstance: any;
  Roles: any[] = [];
  // public CASHIER_ROUTE: any[] = [];
  constructor(private cacheService: CacheService, private eventService: EventsService,
              private _scrollToService: ScrollToService) {  }

  public getAuthUser() {
    return JSON.parse(sessionStorage.getItem(ENV.USERTOKEN));
  }
  public getAuthToken() {
    const token = this.cacheService.getSession(ENV.TOKEN);
    const decodedToken = JWT_DECODE(token);
    return decodedToken['data']['public'];
  }
  public setRoles() {
    this.Roles = [];
    const user = this.getAuthUser();
    if (user && user.roles) {
      user.roles.forEach((role) => {
        this.Roles.push(role.name);
      });
      return this.Roles;
    } else {
      return this.Roles;
    }
  }
  public triggerScrollTo() {

    const config: ScrollToConfigOptions = {
      target: 'intro-hero'
    };

    this._scrollToService.scrollTo(config);
  }

  public processCommonJs2() {
    $('body').css('background-color', '#f4f7f6');
  }
  public openModal(id) {
    setTimeout(() => {
      (<any>$('#' + id)).modal({show: true, backdrop: 'static', keyboard: false});
    }, 20);
  }
  public closeModal(id) {
    (<any>$('#' + id)).modal('hide');
  }
  startDatatable(id) {
    setTimeout(() => {
      this.initDataTable(id);
    }, 1000);
  }

  riderTable(id, res) {
    setTimeout(() => {
      this.initDataTable(id, res);
    }, 1000);
  }

  public initDataTable(id, responsive = true) {
    if (this.dataTableInstance) {
      console.log('DESTROYER ', this.dataTableInstance);
      this.dataTableInstance.destroy();
    }
    const buttons = ['pdf', 'print', 'excel', 'csv', 'copy'];
    setTimeout(() => {
      this.dataTableInstance = ($('#' + id)as any).DataTable({
        pagingType: 'full_numbers',
        dom: 'Blfrtip',
        keys: !0,
        buttons: buttons,
        // order: [[1, 'asc']],
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Search...',
          paginate: {
            previous: '<i class=\'fa fa-angle-left\'>',
            next: '<i class=\'fa fa-angle-right\'>'
          }
        },
        select: {
          // style: 'multi'
        },
        columnDefs: [ {
          targets: 'no-sort',
          orderable: false,
        },
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: -1 }
          ],
        'lengthMenu': [
          [50, 100, 150, -1],
          [50, 100, 150, 'All']
        ],
        responsive: responsive,
      });
      $('.dt-buttons .btn').removeClass('btn-secondary').addClass('btn-sm btn-primary');
      // Add event listener for opening and closing details
      $(`#${id} tbody`).on('click', 'td.details-control', (e) => {
        const tr = (<any>$(this)).closest('tr');
        const row = this.dataTableInstance.row( tr );
        const target = $(`#${e.target.id}`);
        if ( row.child.isShown() ) {
          this.handleIconSwitch(target);
          tr.removeClass('shown');
          $('.dtr-details').addClass('table-bordered table-hover table-striped');

        } else {
          this.handleIconSwitch(target);
          tr.addClass('shown');
          $('.dtr-details').addClass('table-bordered table-hover table-striped');

        }
      });
    }, 400);

  }
  public handleIconSwitch(target) {
    if (target.hasClass('isShown')) {
      target.removeClass('isShown');
      target.addClass('isNotShown');
    } else {
      target.addClass('isShown');
      target.removeClass('isNotShown');
    }
  }
  public confirmAction(callback) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    });
    swalWithBootstrapButtons({
      title: 'Are you sure?',
      text: `You won't be able to revert action! `,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        callback();
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        console.log('Action not completed!');
      }
    });
  }
  public actionRequireLogout(callback) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    });
    swalWithBootstrapButtons({
      title: 'Are you sure?',
      text: `This action requires the system to log you out!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        callback();
      } else if (
        // Read more about handling dismissals
        result.dismiss === swal.DismissReason.cancel
      ) {
        console.log('Action not completed!');
      }
    });
  }
  public validateImage(e, height, width, failCallback, successCallback) {
    $('.cd-panel').css({'z-index': '0'});
    console.log('Event ', (<HTMLInputElement>e.target).files[0]);
    const fileUpload = (<HTMLInputElement>e.target).files[0];
    console.log('File uplioad', fileUpload, fileUpload.size);
    // Initiate the FileReader object.
    const reader: FileReader = new FileReader();
    // Read the contents of Image File.
    reader.readAsDataURL(fileUpload);
    reader.onload = function (et: Event) {
      // Initiate the JavaScript Image object.
      const image = new Image();
      // Set the Base64 string return from FileReader as source.
      image.src = <any>reader.result;
      image.onload = function () {
        // Determine the Height and Width.
        const OutHeight = (<HTMLInputElement>this).height;
        const OutWidth = (<HTMLInputElement>this).width;
        // dimensions.push({width: OutWidth, height: OutHeight});
        if (fileUpload.size < 100000) {
          failCallback(OutWidth, OutHeight);
          return false;
        }
        if (OutHeight < height || OutWidth < width ) {
          // error, image width cannot be less than, height less than
          failCallback(OutWidth, OutHeight);
          return false;
        }
        successCallback(OutWidth, OutHeight);
        return true;
      };
    };

  }
}
