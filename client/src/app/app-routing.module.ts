import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth-layout/auth-layout.component';
import {AuthGuard} from "./guards/auth.guard";
import {LoggedInGuard} from "./guards/loggedin.guard";
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },

  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'login', canActivate: [LoggedInGuard],
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'project', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/project/project.module').then(m => m.ProjectModule)
      },
      {
        path: 'home', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'forms', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/mis-forms/mis-forms.module').then(m => m.MisFormsModule)
      },
      {
        path: 'forms/data/:formtable', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/form-data/form-data.module').then(m => m.FormDataModule)
      },
      {
        path: 'formSettings/form/:formtable', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/form-setting/form-setting.module').then(m => m.FormSettingModule)
      },
      {
        path: 'entity', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/entities.module').then(m => m.EntitiesModule)
      },
      {
        path: 'tasklist', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/tasklist/task-list.module').then(m => m.TaskListModule)
      },
      {
        path: 'formView/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/form-view/form-view.module').then(m => m.FormViewModule)
      },
      {
        path: 'createEntity', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/create-entities/create-entities.module').then(m => m.CreateEntitiesModule)
      },
      {
        path: 'entity/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/entity-tables/entity-tables.module').then(m => m.EntityTablesModule)
      },
      {
        path: 'linkForm/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/link-form/link-form.module').then(m => m.LinkFormModule)
      },
      {
        path: 'entityView', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-views/entity-views.module').then(m => m.EntityViewsModule)
      },
      {
        path: 'createEntityView/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-views/create-entity-views/create-entity-views.module').then(m => m.CreateEntityViewsModule)
      },
      {
        path: 'entityView/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-views/entity-view-table/entity-view-table.module').then(m => m.EntityViewTableModule)
      },
      {
        path: 'tags', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/tags/tags.module').then(m => m.TagsModule)
      },
      {
        path: 'tagType', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/tag-type/tag-type.module').then(m => m.TagTypeModule)
      },
      {
        path: 'dashboards',
        loadChildren: './pages/dashboards/dashboards.module#DashboardsModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'components',
        loadChildren: './pages/components/components.module#ComponentsModule'
      },
      {
        path: 'tables',
        loadChildren: './pages/tables/tables.module#TablesModule'
      },
      {
        path: 'maps',
        loadChildren: './pages/maps/maps.module#MapsModule'
      },
      {
        path: 'widgets',
        loadChildren: './pages/widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'charts',
        loadChildren: './pages/charts/charts.module#ChartsModule'
      },
      {
        path: 'calendar',
        loadChildren: './pages/calendar/calendar.module#CalendarModule'
      },
      {
        path: 'examples',
        loadChildren: './pages/examples/examples.module#ExamplesModule'
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren:
          './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [ CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
