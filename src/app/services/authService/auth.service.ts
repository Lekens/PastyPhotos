/**
 *
 * Created By Arokoyu Olalekan Ojo <arokoyuolalekan@gmail.com> @ 8/9/2019
 *
 */
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CacheService} from '../cacheService/cache.service';
import {HttpClient} from '@angular/common/http';
import { environment as ENV } from '../../../environments/environment';
import * as JWT_DECODE from 'jwt-decode';
import {DecryptService} from '../decryptService/decrypt.service';
import {UtilService} from '../utilService/util.service';
import {UserService} from '../api-handlers/userService/user.service';
import {EventsService} from '../eventServices/event.service';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private decryptData: DecryptService,
    private utilService: UtilService,
    private eventService: EventsService,
    private activatedRoute: ActivatedRoute, private cache: CacheService) {
  }

  /**
   *
   * @returns {boolean}
   */
  public loggedIn(url?: string): boolean {
    return  this.checkUserLogin(url);
  }
  /**
   *
   * @returns {boolean}
   */
  public checkPrivilege(url): boolean {
    const userRole = this.utilService.getAuthUser();
    if (!userRole) {
      return false;
    }
    return userRole.role.toLowerCase() === 'user' || userRole.role.toLowerCase() === 'super';
  }

  /**
   * Ensure user / member sign in
   * @returns {boolean}
   */
  public checkUserLogin(url?: string): boolean {
    if (this.checkPrivilege(url)) {
      const userToken = this.utilService.getAuthToken();
      const userObject = this.utilService.getAuthUser();
      if (userObject === undefined || userObject === '' || userObject === null
        || userToken === undefined || userToken === '' || userToken === null ) {
        this.cache.deleteSession(ENV.TOKEN);
        this.cache.deleteSession(ENV.USERTOKEN);
        return false;
      } else {
        // console.log('userDataDecrypted:', userToken);
        const actionKey = userToken.accessToken;
        // console.log('USERTOKENS', ENV.ACTION_KEY, actionKey);
        if (actionKey !== ENV.ACTION_KEY || userToken.email !== userObject.email) {
          this.cache.deleteSession(ENV.TOKEN);
          this.cache.deleteSession(ENV.USERTOKEN);
          return false;
        }
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   *
   * @returns {boolean}
   */
  public logOut() {
    $('body').css('background-color', 'inherit');
    this.cache.clearSession();
    this.cache.clearStorage();
    return true;
  }
  public logUserOut() {
    this.userService.logOut().subscribe(() => {
      this.logOut();
    });
    this.logOut();
    this.router.navigate(['/']);
  }
}
