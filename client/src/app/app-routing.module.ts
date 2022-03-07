import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
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
        path: 'taskList', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/task-list/task-list.module').then(m => m.TaskListModule)
      },
      {
        path: 'formView/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/report-form/report-form.module').then(m => m.ReportFormModule)
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
        path: 'referrals-list', canActivate: [AuthGuard],
        loadChildren: ()=> import('./mis-components/referrals/referrals.module').then(m => m.ReferralsModule)
      },
      {
        path: 'create-referral', canActivate: [AuthGuard],
        loadChildren: ()=> import('./mis-components/referrals/create-referral/create-referral.module').then(m => m.CreateReferralModule)
      },
      {
        path: 'action-referral/:id', canActivate:[AuthGuard],
        loadChildren: () => import('./mis-components/referrals/action-referral/action-referral.module').then(m => m.ActionReferralModule)
      },
      {
        path: 'feedback-list', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/feedback/feedback.module').then(m => m.FeedbackModule)
      },
      {
        path: 'action-feedback/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/feedback/action-feedback/action-feedback.module').then(m => m.ActionFeedbackModule)
      },
      {
        path: 'create-feedback', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/feedback/create-feeback/create-feedback.module').then(m => m.CreateFeedbackModule)
      },
      {
        path:'groups', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/groups/groups.module').then(m => m.GroupsModule)
      },
      {
        path: 'group/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/groups/create-group/create-group.module').then(m => m.CreateGroupModule)
      },
      {
        path: 'group/edit/:id', canActivate: [AuthGuard],
        loadChildren:() => import('./mis-components/groups/edit-group/edit-group.module').then(m => m.EditGroupModule)
      },
      {
        path: 'users', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'user/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/users/create-user/create-user.module').then(m => m.CreateUserModule)
      },
      {
        path: 'user/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/users/edit-user/edit-user.module').then(m => m.EditUserModule)
      },{
        path:'roles', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/roles/roles.module').then(m => m.RolesModule)
      },
      {
        path:'role/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/roles/create-role/create-role.module').then(m => m.CreateRoleModule)
      },
      {
        path: 'role/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/roles/edit-role/edit-role.module').then(m => m.EditRoleModule)
      },
      {
        path: 'scheduledTasks', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/scheduled-tasks/scheduled-tasks.module').then(m => m.ScheduledTasksModule)
      },
      {
        path: 'requestMaps', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/request-maps/request-maps.module').then(m => m.RequestMapsModule)
      },
      {
        path:'requestMaps/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/request-maps/create-request-maps/create-request-maps.module').then(m => m.CreateRequestMapsModule)
      },
      {
        path: 'requestMaps/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/request-maps/edit-request-maps/edit-request-maps.module').then(m => m.EditRequestMapsModule)
      },
      {
        path: 'milestones', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/project-milestones/project-milestones.module').then(m => m.ProjectMilestonesModule)
      },
      {
        path:'milestones/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/project-milestones/create-project-milestones/create-project-milestones.module').then(m => m.CreateProjectMilestonesModule)
      },
      {
        path: 'milestones/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/project-milestones/edit-project-milestones/edit-project-milestones.module').then(m => m.EditProjectMilestonesModule)
      },
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
