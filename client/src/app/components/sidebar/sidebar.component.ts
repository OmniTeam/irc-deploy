import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FormService} from '../../services/form.service';
import {ReplacePipe} from '../../replace-pipe';
import {EntityService} from '../../services/entity.service';
import {TitleCasePipe} from '@angular/common';

const misc: any = {
  sidebar_mini_active: true
};

const formsMenu: any = {
  path: 'forms/data',
  title: 'Data',
  type: 'sub',
  icontype: 'ni-single-copy-04 text-red',
  isCollapsed: true,
  roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_YCD_PARTNER_DATA_MANAGER', 'ROLE_VAC_PARTNER_DATA_MANAGER', 'ROLE_AGPP_PARTNER_DATA_MANAGER', 'ROLE_VAC_PARTNER_DATA_VIEWER', 'ROLE_YCD_PARTNER_DATA_VIEWER', 'ROLE_AGPP_PARTNER_DATA_VIEWER', 'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER', 'ROLE_STAFF_DATA_VIEWER'],
  children: []
};

const listsMenu: any = {
  path: 'entity/showData/',
  title: 'Lists',
  type: 'sub',
  icontype: 'fas fa-list-alt text-maroon',
  isCollapsed: true,
  children: [],
  roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_VAC_PARTNER_DATA_MANAGER', 'ROLE_AGPP_PARTNER_DATA_MANAGER', 'ROLE_YCD_PARTNER_DATA_MANAGER', 'ROLE_VAC_PARTNER_DATA_VIEWER', 'ROLE_AGPP_PARTNER_DATA_VIEWER',  'ROLE_YCD_PARTNER_DATA_VIEWER', 'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER' , 'ROLE_STAFF_DATA_VIEWER']
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
export const ROUTES: RouteInfo[] = [
  /*{
    path: '/',
    title: 'Home',
    type: 'link',
    icontype: 'fas fa-home',
    roles: [
      "ROLE_SUPER_ADMIN",
      "ROLE_ADMIN",
      "ROLE_VAC_PARTNER_DATA_MANAGER",
      "ROLE_AGPP_PARTNER_DATA_MANAGER",
      "ROLE_YCD_PARTNER_DATA_MANAGER",
      "ROLE_VAC_PARTNER_DATA_VIEWER",
      "ROLE_AGPP_PARTNER_DATA_VIEWER",
      "ROLE_YCD_PARTNER_DATA_VIEWER",
      "ROLE_VAC_STAFF_DATA_MANAGER",
      "ROLE_AGPP_STAFF_DATA_MANAGER",
      "ROLE_YCD_STAFF_DATA_MANAGER",
      "ROLE_STAFF_DATA_VIEWER",
    ]
  },
  formsMenu,
  // listsMenu,
  {
    path: '/',
    title: 'Tasks',
    type: 'sub',
    icontype: 'fas fa-tasks text-pink',
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_YCD_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_MANAGER", "ROLE_AGPP_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_VIEWER", "ROLE_YCD_PARTNER_DATA_VIEWER", "ROLE_AGPP_PARTNER_DATA_VIEWER", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER", "ROLE_STAFF_DATA_VIEWER"],
    isCollapsed: true,
    children: [
      {
        path: 'taskList',
        title: 'Task List',
        type: 'link',
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_YCD_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_MANAGER", "ROLE_AGPP_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_VIEWER", "ROLE_YCD_PARTNER_DATA_VIEWER", "ROLE_AGPP_PARTNER_DATA_VIEWER", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER", "ROLE_STAFF_DATA_VIEWER"]
      },
    ]
  },
  {
    path: '/',
    title: 'Admin',
    type: 'sub',
    icontype: 'fas fa-user-cog',
    isCollapsed: true,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_YCD_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_MANAGER", "ROLE_AGPP_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_VIEWER", "ROLE_YCD_PARTNER_DATA_VIEWER", "ROLE_AGPP_PARTNER_DATA_VIEWER", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER", "ROLE_STAFF_DATA_VIEWER", ],
    children: [
      {
        path: 'tags',
        title: 'Tags',
        type: 'link',
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_YCD_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_MANAGER", "ROLE_AGPP_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_VIEWER", "ROLE_YCD_PARTNER_DATA_VIEWER", "ROLE_AGPP_PARTNER_DATA_VIEWER", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER", "ROLE_STAFF_DATA_VIEWER"]
      },
      {
        path: 'partnerSetupList',
        title: 'Work Plan',
        type: 'link',
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER", "ROLE_STAFF_DATA_VIEWER"]
      },
      {
        path: 'programPartner',
        title: 'Program Partner',
        type: 'link',
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_YCD_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_MANAGER", "ROLE_AGPP_PARTNER_DATA_MANAGER", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER"]
      },
      {
        path: 'mis-users',
        title: 'Users',
        type: 'link',
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_YCD_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_MANAGER", "ROLE_AGPP_PARTNER_DATA_MANAGER", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER"]
      },
      {
        path: 'issdugdata.net:3000',
        title: 'Analytics',
        type: 'analytics',
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_YCD_PARTNER_DATA_MANAGER", "ROLE_VAC_PARTNER_DATA_MANAGER", "ROLE_AGPP_PARTNER_DATA_MANAGER", "ROLE_VAC_STAFF_DATA_MANAGER", "ROLE_AGPP_STAFF_DATA_MANAGER","ROLE_YCD_STAFF_DATA_MANAGER"]
      },
    ]
  },

  {
    path: '/',
    title: 'Set-Up',
    type: 'sub',
    icontype: 'fas fa-cog text-blue',
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
    isCollapsed: true,
    children: [
      {
        path: '', title: 'Program', type: 'sub', isCollapsed: true, roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
        children: [
          {path: 'program', title: 'Add Program', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
          {
            path: 'programCategory',
            title: 'Add Program Category',
            type: 'link',
            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]
          },
        ]
      },
      {path: 'milestones', title: 'Project Milestones', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]}
    ]
  },

  {
    path: '/',
    title: 'Configuration',
    type: 'sub',
    icontype: 'fas fa-tools text-purple',
    isCollapsed: true,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
    children: [
      {path: 'forms', title: 'Forms', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
      formSettingsMenu,
      {
        path: '', title: 'Entities', type: 'sub', isCollapsed: true, roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
        children: [
          {path: 'entity', title: 'Entities', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
          {path: 'entityView', title: 'Entity Views', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
          {
            path: 'entityViewFilter',
            title: 'Entity View Filters',
            type: 'link',
            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]
          },
          {path: 'dataView', title: 'Data View', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
        ]
      },
      {path: 'tagType', title: 'Tag Type', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
      {path: 'scheduledTasks', title: 'Scheduled Tasks', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
    ]
  },
  {
    path: '',
    title: 'User',
    type: 'sub',
    icontype: 'fas fa-user-tie text-green',
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
    isCollapsed: true,
    children: [
      // {path: 'acl-group-mapping', title: 'ACL Group Permissions', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
      {path: 'aclsEntries', title: 'Groups', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
      {path: 'roles', title: 'Roles', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
      {path: 'users', title: 'User Management', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
      {
        path: 'acl-group-mapping-parent',
        title: 'ACL Group Permissions With Parent',
        type: 'link',
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]
      },
      {path: 'requestMaps', title: 'Request Maps', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
    ]
  },*/
];

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
    if (this.authService.isLoggedIn()) {
      this.formService.getEnabledForms().subscribe(data => {
        for (const form of data) {
          const formObject = {};
          const formSettingObject = {};
          formObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(form.displayName, '_', ' '));
          formObject['path'] = form.name.toString();
          formObject['type'] = 'link';

          const currentString = formObject['title'].slice(0, 3);
          const currentTitle = this.titleCasePipe.transform(new ReplacePipe().transform(form.displayName, '_', ' '));

          this.usersRoles.forEach((a) => {
            const cleanRole = this.titleCasePipe.transform(new ReplacePipe().transform(a, '_', ' '));
            if (cleanRole.includes(currentString)) {
              if (formsMenu.children.length === 0) {
                formObject['roles'] = this.usersRoles;
                formsMenu.children.push(formObject);
              } else {
                for (let i = 0; i < formsMenu.children.length; i++) {
                  if (!(currentTitle.includes(formsMenu.children[i].title)) ) {
                    formObject['roles'] = this.usersRoles;
                    formsMenu.children.push(formObject);
                  }
                }
              }
            }
          });

          if (this.usersRoles.includes('ROLE_SUPER_ADMIN') || this.usersRoles.includes('ROLE_ADMIN') || this.usersRoles.includes('ROLE_STAFF_DATA_VIEWER')) {
            formObject['roles'] = (this.usersRoles);
            formsMenu.children.push(formObject);
          }

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
          /*entityObject['roles'] = [
            "ROLE_SUPER_ADMIN",
            "ROLE_ADMIN",
            "ROLE_YCD_PARTNER_DATA_MANAGER",
            "ROLE_VAC_PARTNER_DATA_MANAGER",
            "ROLE_AGPP_PARTNER_DATA_MANAGER",
            "ROLE_VAC_PARTNER_DATA_VIEWER",
            "ROLE_YCD_PARTNER_DATA_VIEWER",
            "ROLE_AGPP_PARTNER_DATA_VIEWER",
            "ROLE_VAC_STAFF_DATA_MANAGER",
            "ROLE_AGPP_STAFF_DATA_MANAGER",
            "ROLE_YCD_STAFF_DATA_MANAGER",
            "ROLE_STAFF_DATA_VIEWER"
          ];*/

          const entityTitleTrancated = entityObject['title'].slice(0, 3);
          const entityTitle = this.titleCasePipe.transform(new ReplacePipe().transform(entity.name, '_', ' '));

          this.usersRoles.forEach((a) => {
            const cleanRole = this.titleCasePipe.transform(new ReplacePipe().transform(a, '_', ' '));
            if (cleanRole.includes(entityTitleTrancated)) {
              const myArray = listsMenu.children;
              if (myArray.length === 0) {
                entityObject['roles'] = this.usersRoles;
                listsMenu.children.push(entityObject);
              } else {
                for (let i = 0; i < myArray.length; i++) {
                  if (!(myArray[i].title === entityTitle) ) {
                    entityObject['roles'] = this.usersRoles;
                    listsMenu.children.push(entityObject);
                  }
                }
              }
            }
          });

          if (this.usersRoles.includes('ROLE_SUPER_ADMIN') || this.usersRoles.includes('ROLE_ADMIN')) {
            entityObject['roles'] = this.usersRoles;
            listsMenu.children.push(entityObject);
          }
        }

        this.lengthOfChildren = listsMenu.children.length;
        this.my_routes.push(
          {
            path: '/',
            title: 'Home',
            type: 'link',
            icontype: 'fas fa-home',
            roles: [
              'ROLE_SUPER_ADMIN',
              'ROLE_ADMIN',
              'ROLE_VAC_PARTNER_DATA_MANAGER',
              'ROLE_AGPP_PARTNER_DATA_MANAGER',
              'ROLE_YCD_PARTNER_DATA_MANAGER',
              'ROLE_VAC_PARTNER_DATA_VIEWER',
              'ROLE_AGPP_PARTNER_DATA_VIEWER',
              'ROLE_YCD_PARTNER_DATA_VIEWER',
              'ROLE_VAC_STAFF_DATA_MANAGER',
              'ROLE_AGPP_STAFF_DATA_MANAGER',
              'ROLE_YCD_STAFF_DATA_MANAGER',
              'ROLE_STAFF_DATA_VIEWER',
            ]
          },
          formsMenu,
          {
            path: '/',
            title: 'Tasks',
            type: 'sub',
            icontype: 'fas fa-tasks text-pink',
            roles: [
              'ROLE_SUPER_ADMIN',
              'ROLE_ADMIN',
              'ROLE_YCD_PARTNER_DATA_MANAGER',
              'ROLE_VAC_PARTNER_DATA_MANAGER',
              'ROLE_AGPP_PARTNER_DATA_MANAGER',
              'ROLE_VAC_STAFF_DATA_MANAGER',
              'ROLE_AGPP_STAFF_DATA_MANAGER',
              'ROLE_YCD_STAFF_DATA_MANAGER',
              'ROLE_STAFF_DATA_VIEWER'
            ],
            isCollapsed: true,
            children: [
              {
                path: 'taskList',
                title: 'Task List',
                type: 'link',
                roles: [
                  'ROLE_SUPER_ADMIN', 'ROLE_ADMIN',
                  'ROLE_YCD_PARTNER_DATA_MANAGER',
                  'ROLE_VAC_PARTNER_DATA_MANAGER',
                  'ROLE_AGPP_PARTNER_DATA_MANAGER',
                  'ROLE_VAC_STAFF_DATA_MANAGER',
                  'ROLE_AGPP_STAFF_DATA_MANAGER',
                  'ROLE_YCD_STAFF_DATA_MANAGER',
                  'ROLE_STAFF_DATA_VIEWER'
                ]
              },
            ]
          },
          {
            path: '/',
            title: 'Admin',
            type: 'sub',
            icontype: 'fas fa-user-cog',
            isCollapsed: true,
            roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER'],
            children: [
              {
                path: 'tags',
                title: 'Tags',
                type: 'link',
                roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER']
              },
              {
                path: 'partnerSetupList',
                title: 'Work Plan',
                type: 'link',
                roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER']
              },
              {
                path: 'programPartner',
                title: 'Partner',
                type: 'link',
                roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN',  'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER']
              },
              {
                path: 'mis-users',
                title: 'Users',
                type: 'link',
                roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN',  'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER']
              },
              {
                path: 'issdugdata.net:3000',
                title: 'Analytics',
                type: 'analytics',
                roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN',  'ROLE_VAC_STAFF_DATA_MANAGER', 'ROLE_AGPP_STAFF_DATA_MANAGER', 'ROLE_YCD_STAFF_DATA_MANAGER']
              },
              {
                path: '',
                title: 'Grant Process',
                type: 'sub',
                isCollapsed: true,
                roles: ['ROLE_SUPER_ADMIN'],
                children: [
                  {path: 'grantProcess', title: 'Short Term', type: 'link', roles: ['ROLE_SUPER_ADMIN']},
                  {path: 'grantProcess-longTerm', title: 'Long Term', type: 'link', roles: ['ROLE_SUPER_ADMIN']},
                ]
              },
            ]
          },

          {
            path: '/',
            title: 'Set-Up',
            type: 'sub',
            icontype: 'fas fa-cog text-blue',
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
            icontype: 'fas fa-tools text-purple',
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
            icontype: 'fas fa-user-tie text-green',
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
