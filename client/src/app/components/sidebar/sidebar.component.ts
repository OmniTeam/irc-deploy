import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FormService} from '../../services/form.service';
import {ReplacePipe} from '../../pipes/replace-pipe';
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
  roles: [
    'ROLE_BUDGET_HOLDER',
    'ROLE_SUPER_ADMIN',
    'ROLE_ADMIN'
  ],
  children: [
  ]
};

const dataMenu: any = {
  path: 'dataView/showData',
  title: 'Lists',
  type: 'sub',
  icontype: 'ni-single-copy-04 text-red',
  isCollapsed: true,
  roles: [
    'ROLE_BUDGET_HOLDER',
    'ROLE_SUPER_ADMIN',
    'ROLE_ADMIN',
    'ROLE_REBUILD_DATA_MANAGER'
  ],
  children: [
    {path: '94a360ee-9fef-4659-9b08-ed1aa8a24ccd', title: 'Clients', type: 'link', icontype: 'ni-single-copy-04 text-red',
      roles: [
        'ROLE_BUDGET_HOLDER',
        'ROLE_SUPER_ADMIN',
        'ROLE_ADMIN',
        'ROLE_REBUILD_DATA_MANAGER'
      ], },
      {path: 'ee9eea88-edc0-4316-8fdf-9219f92c01d6', title: 'Services', type: 'link', icontype: 'ni-single-copy-04 text-red',
      roles: [
        'ROLE_BUDGET_HOLDER',
        'ROLE_SUPER_ADMIN',
        'ROLE_ADMIN',
        'ROLE_REBUILD_DATA_MANAGER'
      ], },
  ]
};

const listsMenu: any = {
  path: 'entity/showData/',
  title: 'Entities',
  type: 'sub',
  icontype: 'fas fa-list-alt text-maroon',
  isCollapsed: true,
  children: [
  ],
  roles: [
    'ROLE_BUDGET_HOLDER',
    'ROLE_SUPER_ADMIN',
    'ROLE_ADMIN',
  ]
};


const formSettingsMenu: any = {
  path: 'formSettings/form',
  title: 'Form Settings',
  type: 'sub',
  isCollapsed: true,
  roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
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
  {
    path: '/',
    title: 'Home',
    type: 'link',
    icontype: 'fas fa-home',
    roles: [
      'ROLE_BUDGET_HOLDER',
      'ROLE_SUPER_ADMIN',
      'ROLE_ADMIN',
      'ROLE_REBUILD_DATA_VIEWER',
      'ROLE_REBUILD_DATA_MANAGER'

    ]
  },
  {
    path: 'activity-list',
    title: 'Activity Report',
    type: 'link',
    icontype: 'ni-single-copy-04 text-pink',
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_REBUILD_DATA_MANAGER' ],
  },
  // formsMenu,
  dataMenu,
  listsMenu,
  {
    path: 'referrals-list',
    title: 'Referrals',
    type: 'link',
    icontype: 'ni-single-copy-04 text-pink',
    roles: ['ROLE_BUDGET_HOLDER', 'ROLE_SUPER_ADMIN',  'ROLE_ADMIN', 'ROLE_REBUILD_DATA_VIEWER', 'ROLE_REBUILD_DATA_MANAGER'],
  },
  {
    path: 'feedback-list',
    title: 'FeedBack',
    type: 'link',
    icontype: 'fa fa-comment-dots',
    roles: ['ROLE_BUDGET_HOLDER', 'ROLE_SUPER_ADMIN',  'ROLE_ADMIN', 'ROLE_REBUILD_DATA_VIEWER', 'ROLE_REBUILD_DATA_MANAGER'],
  },
  {
    path: 'archive',
    title: 'Archive',
    type: 'link',
    icontype: 'fas fa-tasks text-pink',
    roles: ['ROLE_SUPER_ADMIN',  'ROLE_ADMIN'],
  },

  {
    path: '/',
    title: 'Admin',
    type: 'sub',
    icontype: 'fas fa-user-cog',
    isCollapsed: true,
    roles: ['ROLE_BUDGET_HOLDER', 'ROLE_SUPER_ADMIN',  'ROLE_ADMIN', 'ROLE_REBUILD_DATA_MANAGER'],
    children: [
      {path: 'tags', title: 'Tags', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN']},
      {path: 'taskList', title: 'Task List', type: 'link', roles: ['ROLE_SUPER_ADMIN',  'ROLE_ADMIN', 'ROLE_REBUILD_DATA_MANAGER']},
      {path: 'workPlanList', title: 'Work Plan', type: 'link', roles: ['ROLE_BUDGET_HOLDER', 'ROLE_SUPER_ADMIN',  'ROLE_ADMIN', 'ROLE_REBUILD_DATA_MANAGER']},
      {path: 'programStaff', title: 'Program Staff', type: 'link', roles:  ['ROLE_SUPER_ADMIN',  'ROLE_ADMIN']},
      {path: 'users', title: 'Users', type: 'link', roles:  ['ROLE_SUPER_ADMIN',  'ROLE_ADMIN']},
      {path: 'issdugdata.net:3000', title: 'Analytics', type: 'analytics', roles: ['ROLE_BUDGET_HOLDER', 'ROLE_SUPER_ADMIN',  'ROLE_ADMIN', 'ROLE_REBUILD_DATA_MANAGER']},
    ]
  },

  {
    path: '/',
    title: 'Set-Up',
    type: 'sub',
    icontype: 'fas fa-cog text-blue',
    isCollapsed: true,
    roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
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
    roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/],
    children: [
      {path: 'forms', title: 'Forms', type: 'link', roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/], },
      formSettingsMenu,
      {
        path: '', title: 'Entities', type: 'sub', isCollapsed: true, roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/],
        children: [
          {path: 'entity', title: 'Entities', type: 'link', roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/], },
          {path: 'entityView', title: 'Entity Views', type: 'link', roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/], },
          {path: 'entityViewFilter', title: 'Entity View Filters', type: 'link', roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/], },
          {path: 'dataView', title: 'Data View', type: 'link', roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/], },
        ]
      },
      {path: 'tagType', title: 'Tag Type', type: 'link', roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/], },
      {path: 'scheduledTasks', title: 'Scheduled Tasks', type: 'link', roles: ['ROLE_SUPER_ADMIN'/*, 'ROLE_ADMIN'*/], },
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
      {path: 'groups', title: 'Groups', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'], },
      {path: 'roles', title: 'Roles', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'], },
      {path: 'users', title: 'User Management', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'], },
      {path: 'requestMaps', title: 'Request Maps', type: 'link', roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'], }
    ]
  },

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
  arr: any;

  constructor(private router: Router, public authService: AuthService, private formService: FormService,
              private entityService: EntityService,
              private titleCasePipe: TitleCasePipe) {
  }

  ngOnInit() {
    this.usersRoles = this.authService.getUserRoles();
    console.log(this.usersRoles, 'user role');
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
    if (this.authService.isLoggedIn()) {
      this.entityService.getEntities().subscribe((data) => {
        for (const entity of data) {
          const entityObject = {};
          entityObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(entity.name, '_', ' '));
          entityObject['path'] = entity.id;
          entityObject['type'] = 'link';
          entityObject['roles'] = this.usersRoles;
          listsMenu.children.push(entityObject);
        }
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
