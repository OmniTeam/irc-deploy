import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FormService} from '../../services/form.service';
import {ReplacePipe} from '../../pipes/replace-pipe';
import {EntityService} from '../../services/entity.service';
import {TitleCasePipe} from '@angular/common';
import {Roles} from '../../models/roles';

const misc: any = {
  sidebar_mini_active: true
};

const formsMenu: any = {
  path: 'forms/data',
  title: 'Data',
  type: 'sub',
  icontype: 'ni-single-copy-04',
  isCollapsed: true,
  roles: [
    'ROLE_SUPER_ADMIN',
    'ROLE_ADMIN',
    'ROLE_PARTNER_DATA_MANAGER',
    'ROLE_PARTNER_DATA_VIEWER',
    'ROLE_STAFF_DATA_MANAGER',
    'ROLE_STAFF_DATA_VIEWER'
  ],
  children: []
};

const listsMenu: any = {
  path: 'entity/showData/',
  title: 'Lists',
  type: 'sub',
  icontype: 'fas fa-list-alt',
  isCollapsed: true,
  children: [],
  roles: [
    'ROLE_SUPER_ADMIN',
    'ROLE_ADMIN',
    'ROLE_PARTNER_DATA_MANAGER',
    'ROLE_PARTNER_DATA_VIEWER',
    'ROLE_STAFF_DATA_MANAGER',
    'ROLE_STAFF_DATA_VIEWER'
  ]
};


const formSettingsMenu: any = {
  path: 'formSettings/form',
  title: 'Form Settings',
  type: 'sub',
  isCollapsed: true,
  roles: ['ROLE_SUPER_ADMIN'],
  children: []
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
  roles?: any;
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
  roles?: any;
}

export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
  roles?: any;
}

// Menu Items
export const ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [TitleCasePipe]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  usersRoles: any;
  my_routes = [];
  private lengthOfChildren: number;
   childrenArray: any;

  constructor(private router: Router, public authService: AuthService, private formService: FormService,
              private entityService: EntityService,
              private titleCasePipe: TitleCasePipe) {
  }

  ngOnInit() {
    this.usersRoles = this.authService.getUserRoles();

    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
    // console.log(this.authService.isLoggedIn());
    if (this.authService.isLoggedIn()) {
      // console.log('am being loaded');
      this.formService.getEnabledForms().subscribe(data => {
        for (const form of data) {
          const formObject = {};
          const formSettingObject = {};
          formObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(form.displayName, '_', ' '));
          formObject['path'] = form.name.toString();
          formObject['type'] = 'link';
          formObject['roles'] = this.usersRoles;

          formsMenu.children.push(formObject);

          formSettingObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(form.displayName, '_', ' '));
          formSettingObject['path'] = form.name.toString();
          formSettingObject['type'] = 'link';
          formSettingObject['roles'] = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'];
          formSettingsMenu.children.push(formSettingObject);
        }
      }, error => console.log(error));

      this.entityService.getEntities().subscribe((data) => {
        for (const entity of data) {
          const entityObject = {};
          entityObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(entity.name, '_', ' '));
          entityObject['path'] = entity.id;
          entityObject['type'] = 'link';
          entityObject['roles'] = this.usersRoles;

          listsMenu.children.push(entityObject);
        }

        this.lengthOfChildren = listsMenu.children.length;
        this.my_routes.push(
          {
            path: 'home',
            title: 'Home',
            type: 'link',
            icontype: 'fas fa-home',
            roles: [
              'ROLE_SUPER_ADMIN',
              'ROLE_ADMIN',
              'ROLE_PARTNER_DATA_MANAGER',
              'ROLE_PARTNER_DATA_VIEWER',
              'ROLE_STAFF_DATA_MANAGER',
              'ROLE_STAFF_DATA_VIEWER',
              'ROLE_APPLICANT',
            ]
          },
          formsMenu,
          {
            path: 'archive',
            title: 'Archive',
            type: 'link',
            icontype: 'fas fa-tasks',
            roles: [
              'ROLE_SUPER_ADMIN',
              'ROLE_ADMIN',
              'ROLE_STAFF_DATA_MANAGER',
              'ROLE_STAFF_DATA_VIEWER'
            ],
          },
          {
            path: '/',
            title: 'Admin',
            type: 'sub',
            icontype: 'fas fa-user-cog',
            isCollapsed: true,
            roles: [
              'ROLE_SUPER_ADMIN',
              'ROLE_ADMIN',
              'ROLE_STAFF_DATA_MANAGER',
              'ROLE_STAFF_DATA_VIEWER',
              'ROLE_PARTNER_DATA_MANAGER',
              'ROLE_PARTNER_DATA_VIEWER',
              'ROLE_PROGRAM_OFFICER'
            ],
            children: [
              {
                path: 'tags',
                title: 'Tags',
                type: 'link',
                roles: [
                  'ROLE_SUPER_ADMIN',
                  'ROLE_ADMIN',
                  'ROLE_STAFF_DATA_MANAGER',
                  'ROLE_STAFF_DATA_VIEWER',
                  'ROLE_PARTNER_DATA_MANAGER',
                  'ROLE_PARTNER_DATA_VIEWER',
                ]
              },
              {
                path: 'taskList',
                title: 'Task List',
                type: 'link',
                roles: [
                  'ROLE_SUPER_ADMIN',
                  'ROLE_ADMIN',
                  'ROLE_STAFF_DATA_MANAGER',
                  'ROLE_STAFF_DATA_VIEWER'
                ]
              },
              {
                path: 'partnerSetupList',
                title: 'Work Plan',
                type: 'link',
                roles: [
                  'ROLE_SUPER_ADMIN',
                  'ROLE_ADMIN',
                  'ROLE_STAFF_DATA_MANAGER',
                  'ROLE_STAFF_DATA_VIEWER'
                ]
              },
              {
                path: 'programPartner',
                title: 'Partner',
                type: 'link',
                roles: [
                  'ROLE_SUPER_ADMIN',
                  'ROLE_ADMIN',
                  'ROLE_STAFF_DATA_MANAGER',
                  'ROLE_STAFF_DATA_VIEWER'
                ]
              },
              {
                path: 'mis-users',
                title: 'Users',
                type: 'link',
                roles: [
                  'ROLE_SUPER_ADMIN',
                  'ROLE_ADMIN',
                  'ROLE_STAFF_DATA_MANAGER',
                  'ROLE_STAFF_DATA_VIEWER'
                ]
              },
              {
                path: 'issdugdata.net:3000',
                title: 'Analytics',
                type: 'analytics',
                roles: [
                  'ROLE_SUPER_ADMIN',
                  'ROLE_ADMIN',
                  'ROLE_STAFF_DATA_MANAGER',
                  'ROLE_STAFF_DATA_VIEWER'
                ]
              },
              {
                path: '',
                title: 'Grant Process',
                type: 'sub',
                isCollapsed: true,
                roles: ['ROLE_SUPER_ADMIN', 'ROLE_PROGRAM_OFFICER'],
                children: [
                  {path: 'submitletterofinterest', title: 'Short Term', type: 'link', roles: ['ROLE_SUPER_ADMIN']},
                  {path: 'longTermGrantApplication', title: 'Long Term Grant Application', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_PROGRAM_OFFICER']},
                ]
              },
            ]
          },

          {
            path: '/',
            title: 'Set-Up',
            type: 'sub',
            icontype: 'fas fa-cog',
            roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
            isCollapsed: true,
            children: [
              {
                path: '', title: 'Program', type: 'sub', isCollapsed: true, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
                children: [
                  {path: 'program', title: 'Add Program', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
                  {path: 'programCategory', title: 'Add Program Category', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
                ]
              },
              {path: 'milestones', title: 'Project Milestones', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']}
            ]
          },

          {
            path: '/',
            title: 'Configuration',
            type: 'sub',
            icontype: 'fas fa-tools',
            isCollapsed: true,
            roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
            children: [
              {path: 'forms', title: 'Forms', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
              formSettingsMenu,
              {
                path: '', title: 'Entities', type: 'sub', isCollapsed: true, roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
                children: [
                  {path: 'entity', title: 'Entities', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
                  {path: 'entityView', title: 'Entity Views', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
                  {
                    path: 'entityViewFilter',
                    title: 'Entity View Filters',
                    type: 'link',
                    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']
                  },
                  {path: 'dataView', title: 'Data View', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
                ]
              },
              {path: 'tagType', title: 'Tag Type', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
              {path: 'scheduledTasks', title: 'Scheduled Tasks', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
            ]
          },
          {
            path: '',
            title: 'User',
            type: 'sub',
            icontype: 'fas fa-user-tie',
            roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
            isCollapsed: true,
            children: [
              // {path: 'acl-group-mapping', title: 'ACL Group Permissions', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
              {path: 'groups', title: 'Groups', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
              {path: 'roles', title: 'Roles', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
              {path: 'users', title: 'User Management', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
              {
                path: 'acl-group-mapping-lists',
                title: 'Access Control Lists',
                type: 'link',
                roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']
              },
              {path: 'requestMaps', title: 'Request Maps', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
            ]
          }
        );

        if (this.lengthOfChildren > 0) {
          this.my_routes.splice(2, 0, listsMenu);
        }

        this.menuItems = this.my_routes.filter(menuItem => menuItem);

      }, error => console.log(error));
    }

  }

  onMouseEnterSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.add('g-sidenav-show');
    }
  }

  onMouseLeaveSidenav() {
    if (!document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-show');
    }
  }

  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      'sidenav-toggler'
    )[0];
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('g-sidenav-pinned')) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove('g-sidenav-pinned');
      body.classList.add('g-sidenav-hidden');
      sidenavToggler.classList.remove('active');
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add('g-sidenav-pinned');
      body.classList.remove('g-sidenav-hidden');
      sidenavToggler.classList.add('active');
      misc.sidebar_mini_active = true;
    }
  }
}
