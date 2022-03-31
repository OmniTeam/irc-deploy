import {Inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {Roles} from "../models/roles";
import {RolesService} from "../services/roles.service";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  currentUser: string;

  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(RolesService) private rolesService: RolesService,
    @Inject(Router) private router: Router
  ) {
  }

  /**
   * Can this route be activated?
   * @param {ActivatedRouteSnapshot} route - The route.
   * @returns {Promise<boolean>} True if user is authenticated otherwise false
   */
  public async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowedUserRoles = this.getRoutePermissions(route);
    return await this.checkPermission(allowedUserRoles);
  }

  /**
   * Can this child route be activated?
   * @param {ActivatedRouteSnapshot} route - The route.
   * @returns {Promise<boolean>} True if user is authenticated otherwise false
   */
  public async canActivateChild(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowedUserRoles = this.getRoutePermissions(route);
    return await this.checkPermission(allowedUserRoles);
  }

  /**
   * Can this route be loaded.
   * @returns {Promise<boolean>} True if user is authenticated otherwise false
   */
  public canLoad(): Promise<boolean> {
    return this.checkPermission(null);
  }

  /**
   * Get allowed user roles from the route.
   * @param {ActivatedRouteSnapshot} route - The route.
   * @returns {string[]} All user roles that are allowed to access the route.
   */

  private getRoutePermissions(route: ActivatedRouteSnapshot): Roles[] {
    if (route.data && route.data.userRoles) {
      return route.data.userRoles as Roles[];
    }
    return null;
  }

  /**
   * Check if a user is authenticated
   * @param {string[]} allowedUserRoles - These user roles have the permissions to access the route.
   * @returns {Promise<boolean>} True if user is authenticated otherwise false
   */
  private checkPermission(allowedUserRoles: Roles[]): Promise<boolean> {
    return this.authService.getSession().then((session: boolean) => {
      if (session) {
        if (!allowedUserRoles || allowedUserRoles.length == 0) {
          return true;   // if no user roles has been set, all user are allowed to access the route
        } else {
          this.currentUser = this.authService.getLoggedInUsername();
          const params = new HttpParams()
            .set('username', this.currentUser);
          return this.rolesService.getAllUserRoles(params).then((userRoles: string[]) => {
            if (this.authService.areUserRolesAllowed(userRoles, allowedUserRoles)) {
              return true;
            } else {
              this.authService.doLogoutUser();
              this.router.navigate(['/login']);
              return false;
            }
          });
        }
      } else {
        return false;
      }
    });
  }
}
