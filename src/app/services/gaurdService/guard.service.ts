import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../authService/auth.service';
import {Observable} from 'rxjs';
import * as JWT_DECODE from 'jwt-decode';
import {CacheService} from '../cacheService/cache.service';
import {EventsService} from '../eventServices/event.service';
import {DecryptService} from '../decryptService/decrypt.service';
import {environment as ENV} from '../../../environments/environment';
import {BootstrapNotifyService} from '../bootstrap-notify/bootstrap-notify.service';
@Injectable()
export class GuardService implements CanActivate {
  url: string;
  constructor( private router: Router, private eventsService: EventsService,
               private decrypt: DecryptService,
               private bootstrapNotify: BootstrapNotifyService,
               private authService: AuthService, private cache_: CacheService, private cacheService: CacheService) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.url = state.url;
    console.info('URL =>>>>>>> ', this.url);
    return this.checkLogin(this.url);
  }
  checkLogin(url?: string): boolean {
    // return true;
     const user =  this.cacheService.getStorage(ENV.TOKEN);
    if (this.authService.loggedIn(url)) { return true; }
    this.router.navigate([ '/' ]); // then ask user to login
    this.logOut();
    return false;
  }

  /**
   * Log out from system
   */
  logOut() {
    this.cache_.clearStorage();
    this.cache_.clearSession();
  }

}
export class RoleService1 implements CanActivate {
  static getAuthUser() {
    return JSON.parse(sessionStorage.getItem(ENV.USERTOKEN));
  }
  static checkRole(roles): boolean {
    if (!roles.length) { return false; }
    const user = RoleService1.getAuthUser();
    const userRole = user && user.role.toLowerCase();
    return (userRole === 'super' && roles.includes('super') && roles[0] === 'super');
    /*{

    } else {
      return (userRole === 'user' && roles.includes(userRole));
    }*/
  }
  constructor( ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles: any = route.data;
    // console.log('ROLE DATA ', roles);
    return RoleService1.checkRole(roles.roles);
  }
  }

export class RoleService2 implements CanActivate {
  static getAuthUser() {
    return JSON.parse(sessionStorage.getItem(ENV.USERTOKEN));
  }
  static checkRole(roles): boolean {
    if (!roles.length) { return false; }
    const user = RoleService1.getAuthUser();
    const userRole = user && user.role.toLowerCase();
    return (userRole === 'user' && roles.includes(userRole));
  }
  constructor( ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles: any = route.data;
    // console.log('ROLE DATA ', roles);
    return RoleService2.checkRole(roles.roles);
  }
  }
