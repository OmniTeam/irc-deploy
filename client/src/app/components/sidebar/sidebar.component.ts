import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {FormService} from "../../services/form.service";
import {ReplacePipe} from "../../replace-pipe";
import {EntityService} from "../../services/entity.service";
import {TitleCasePipe} from "@angular/common";

let misc: any = {
  sidebar_mini_active: true
};

let formsMenu: any = {
  path: 'forms/data',
  title: 'Data',
  type: 'sub',
  icontype: 'ni-single-copy-04 text-red',
  isCollapsed: true,
  children: []
}

let listsMenu: any = {
  path: 'entity/showData/',
  title: 'Lists',
  type: 'sub',
  icontype: 'fas fa-list-alt text-maroon',
  isCollapsed: true,
  children: []
}


let formSettingsMenu: any = {
  path: 'formSettings/form',
  title: 'Form Settings',
  type: 'sub',
  isCollapsed: true,
  children: []
}

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}

export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: '/',
    title: 'Home',
    type: 'link',
    icontype: 'fas fa-home',
  },
  formsMenu,
  listsMenu,
  {
    path: 'referrals-list',
    title: 'Referrals List',
    type: 'link',
    icontype: 'ni-single-copy-04 text-pink',
  },
  {
    path: 'feedback-list',
    title: 'FeedBack List',
    type: 'link',
    icontype: 'fa fa-comment-dots',
  },
  {
    path: '/',
    title: 'Tasks',
    type: 'sub',
    icontype: 'fas fa-tasks text-pink',
    isCollapsed: true,
    children: [
      {path: 'taskList', title: 'Task List', type: 'link'},
      // {path: 'onGoingTasks', title: 'Ongoing Tasks', type: 'link'},
      // {path: 'taskReport', title: 'Task Report', type: 'link'},
    ]
  },

  {
    path: '/',
    title: 'Admin',
    type: 'sub',
    icontype: 'fas fa-user-cog',
    isCollapsed: true,
    children: [
      {path: 'tags', title: 'Tags', type: 'link'},
      {path: 'programStaff', title: 'Program Staff', type: 'link'},
      {path: 'users', title: 'Users', type: 'link'},
    ]
  },

  {
    path: '/',
    title: 'Set-Up',
    type: 'sub',
    icontype: 'fas fa-cog text-blue',
    isCollapsed: true,
    children: [
      {
        path: '', title: 'Program', type: 'sub', isCollapsed: true,
        children: [
          {path: 'program', title: 'Add Program', type: 'link'},
          {path: 'programCategory', title: 'Add Program Category', type: 'link'},
        ]
      },
      {path: 'milestones', title: 'Project Milestones', type: 'link'}
    ]
  },

  {
    path: '/',
    title: 'Configuration',
    type: 'sub',
    icontype: 'fas fa-tools text-purple',
    isCollapsed: true,
    children: [
      {path: 'forms', title: 'Forms', type: 'link'},
      formSettingsMenu,
      {
        path: '', title: 'Entities', type: 'sub', isCollapsed: true,
        children: [
          {path: 'entity', title: 'Entities', type: 'link'},
          {path: 'entityView', title: 'Entity Views', type: 'link'},
          {path: 'entityViewFilter', title: 'Entity View Filters', type: 'link'},
          {path: 'dataView', title: 'Data View', type: 'link'},
        ]
      },
      {path: 'tagType', title: 'Tag Type', type: 'link'},
      {path: 'scheduledTasks', title: 'Scheduled Tasks', type: 'link'},
    ]
  },
  {
    path: '',
    title: 'User',
    type: 'sub',
    icontype: 'fas fa-user-tie text-green',
    isCollapsed: true,
    children: [
      {path: 'groups', title: 'Groups', type: 'link'},
      {path: 'roles', title: 'Roles', type: 'link'},
      {path: 'users', title: 'User Management', type: 'link'},
      {path: 'requestMaps', title: 'Request Maps', type: 'link'}
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

  constructor(private router: Router, public authService: AuthService, private formService: FormService,
              private entityService: EntityService,
              private titleCasePipe: TitleCasePipe) {
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
    if (this.authService.isLoggedIn()) {
      this.formService.getEnabledForms().subscribe(data => {
        for (let form of data) {
          let formObject = {};
          let formSettingObject = {};
          formObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(form.displayName, '_', ' '));
          formObject['path'] = form.name.toString();
          formObject['type'] = 'link';
          formsMenu.children.push(formObject);

          formSettingObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(form.displayName, '_', ' '));
          formSettingObject['path'] = form.name.toString();
          formSettingObject['type'] = 'link';
          formSettingsMenu.children.push(formSettingObject);
        }
      }, error => console.log(error));

      this.entityService.getEntities().subscribe((data) => {
        for (let entity of data) {
          let entityObject = {};
          entityObject['title'] = this.titleCasePipe.transform(new ReplacePipe().transform(entity.name, '_', ' '));
          entityObject['path'] = entity.id;
          entityObject['type'] = 'link';
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
