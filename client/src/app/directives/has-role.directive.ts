import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {Subscription} from "rxjs";
import {RolesService} from "../services/roles.service";
import {AuthService} from "../services/auth.service";
import {HttpParams} from "@angular/common/http";

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  // the role the user must have
  @Input() hasRole: Array<string>;
  currentUser: string;

  /**
   * @param {ViewContainerRef} viewContainerRef -- the location where we need to render the templateRef
   * @param {TemplateRef<any>} templateRef -- the templateRef to be potentially rendered
   * @param {RolesService} rolesService -- will give us access to the roles a user has
   * @param {AuthService} authService -- will give us access to the authenticated user
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private rolesService: RolesService,
    private authService: AuthService
  ) {
  }

  public ngOnInit(): void {
    let roles = this.authService.getUserRoles();
    if (!roles) {
      // Remove element from DOM
      this.viewContainerRef.clear();
    }
    // user Role are checked by a Roles mention in DOM
    if (this.hasRole) {
      const idx = roles.findIndex((element) => this.hasRole.indexOf(element) !== -1);
      if (idx < 0) {
        this.viewContainerRef.clear();
      } else {
        // appends the ref element to DOM
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      // Remove element from DOM
      this.viewContainerRef.clear();
    }
  }

  /**
   * on destroy cancels the API if its fetching.
   */
  public ngOnDestroy(): void {
    this.subscription.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

}
