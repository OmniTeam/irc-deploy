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
        path: 'taskList', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/task-list/task-list.module').then(m => m.TaskListModule)
      },
      {
        path: 'reportForm/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/report-form/report-form.module').then(m => m.ReportFormModule)
      },
      {
        path: 'entity', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/entities.module').then(m => m.EntitiesModule)
      },
      {
        path: 'entity/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/edit-entities/edit-entities.module').then(m => m.EditEntitiesModule)
      },
      {
        path: 'entity/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/create-entities/create-entities.module').then(m => m.CreateEntitiesModule)
      },
      {
        path: 'entity/showData/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/entity-tables/entity-tables.module').then(m => m.EntityTablesModule)
      },
      {
        path: 'entity/linkForm/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entities/link-form/link-form.module').then(m => m.LinkFormModule)
      },
      {
        path: 'entityView', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-views/entity-views.module').then(m => m.EntityViewsModule)
      },
      {
        path: 'entityView/create/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-views/create-entity-views/create-entity-views.module').then(m => m.CreateEntityViewsModule)
      },
      {
        path: 'entityView/edit/:entityId/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-views/edit-entity-views/edit-entity-views.module').then(m => m.EditEntityViewsModule)
      },
      {
        path: 'entityView/showData/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-views/entity-view-table/entity-view-table.module').then(m => m.EntityViewTableModule)
      },
      {
        path: 'tags', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/tags/tags.module').then(m => m.TagsModule)
      },
      {
        path: 'tags/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/tags/edit-tags/edit-tags.module').then(m => m.EditTagsModule)
      },
      {
        path: 'tagType', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/tag-type/tag-type.module').then(m => m.TagTypeModule)
      },
      {
        path: 'tagType/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/tag-type/edit-tag-type/edit-tag-type.module').then(m => m.EditTagTypeModule)
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
        path: 'program', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program/program.module').then(m => m.ProgramModule)
      },
      {
        path:'program/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program/create-program/create-program.module').then(m => m.CreateProgramModule)
      },
      {
        path: 'program/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program/edit-program/edit-program.module').then(m => m.EditProgramModule)
      },
      {
        path: 'programCategory', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program-category/program-category.module').then(m => m.ProgramCategoryModule)
      },
      {
        path:'programCategory/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program-category/create-program-category/create-program-category.module').then(m => m.CreateProgramCategoryModule)
      },
      {
        path: 'programCategory/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program-category/edit-program-category/edit-program-category.module').then(m => m.EditProgramCategoryModule)
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

      {
        path: 'programStaff', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program-staff/program-staff.module').then(m => m.ProgramStaffModule)
      },
      {
        path:'programStaff/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program-staff/create-program-staff/create-program-staff.module').then(m => m.CreateProgramStaffModule)
      },
      {
        path: 'programStaff/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/program-staff/edit-program-staff/edit-program-staff.module').then(m => m.EditProgramStaffModule)
      },

      {
        path: 'entityViewFilter', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-view-filters/entity-view-filters.module').then(m => m.EntityViewFiltersModule)
      },
      {
        path:'entityViewFilter/create/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-view-filters/create-entity-view-filters/create-entity-view-filters.module').then(m => m.CreateEntityViewFiltersModule)
      },
      {
        path: 'entityViewFilter/edit/:entityViewId/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/entity-view-filters/edit-entity-view-filters/edit-entity-view-filters.module').then(m => m.EditEntityViewFiltersModule)
      },
      {
        path: 'dataView', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/data-views/data-views.module').then(m => m.DataViewsModule)
      },
      {
        path:'dataView/create', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/data-views/create-data-views/create-data-views.module').then(m => m.CreateDataViewsModule)
      },
      {
        path: 'dataView/edit/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/data-views/edit-data-views/edit-data-views.module').then(m => m.EditDataViewsModule)
      },
      {
        path: 'dataView/showData/:id', canActivate: [AuthGuard],
        loadChildren: () => import('./mis-components/data-views/data-view-table/data-view-table.module').then(m => m.DataViewTableModule)
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
