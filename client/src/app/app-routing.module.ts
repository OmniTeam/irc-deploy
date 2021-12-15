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
        path: 'entities', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/entities.module').then(m => m.EntitiesModule)
      },
      {
        path: 'createentities', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/create-entities/create-entities.module').then(m => m.CreateEntitiesModule)
      },
      {
        path: 'entities/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/entity-tables/entity-tables.module').then(m => m.EntityTablesModule)
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
