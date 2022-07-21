import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {AuthGuard} from './guards/auth.guard';
import {LoggedInGuard} from './guards/loggedin.guard';
import {Roles} from './models/roles';
// @ts-ignore
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {
      userRoles: [] // All User Can Access but must be login
    },
  },

  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'login', canActivate: [LoggedInGuard],
        data: {
          userRoles: [] // All User Can Access but must be login
        },
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'project', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/project/project.module').then(m => m.ProjectModule)
      },
      {
        path: 'home', canActivate: [AuthGuard],
        data: {
          userRoles: [] // All User Can Access but must be login
        },
        loadChildren: () => import('./mis-components/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'ongoing-tasks', canActivate: [AuthGuard],
        data: {
          userRoles: [] // All User Can Access but must be login
        },
        loadChildren: () => import('./mis-components/ongoing-tasks/ongoing-tasks.module').then(m => m.OngoingTasksModule)
      },
      {
        path: 'forms', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/mis-forms/mis-forms.module').then(m => m.MisFormsModule)
      },
      {
        path: 'forms/data/:formtable', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/form-data/form-data.module').then(m => m.FormDataModule)
      },
      {
        path: 'formSettings/form/:formtable', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/form-setting/form-setting.module').then(m => m.FormSettingModule)
      },
      {
        path: 'workPlan', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/work-plan/work-plan-setup.module').then(m => m.WorkPlanSetupModule)
      },
      {
        path: 'workPlan/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/work-plan/work-plan-setup.module').then(m => m.WorkPlanSetupModule)
      },
      {
        path: 'taskList', canActivate: [AuthGuard],
        data: {
          userRoles: [ Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/task-list/task-list.module').then(m => m.TaskListModule)
      },
      {
        path: 'workPlanList', canActivate: [AuthGuard],
        data: {
          userRoles: [ Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/work-plan/work-plan-list/work-plan-list.module').then(m => m.WorkPlanListModule)
      },
      {
        path: 'progressReportList', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_FEEDBACK]
        },
        loadChildren: () => import('./mis-components/progress-report-view/archive.module').then(m => m.ArchiveModule)
      },
      {
        path: 'progress-report/:id/:processId/:taskId/:readonly', canActivate: [AuthGuard],
        data: {
          userRoles: [ Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/progress-report/progress-report.module').then(m => m.ProgressReportModule)
      },
      {
        path: 'entity', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entities/entities.module').then(m => m.EntitiesModule)
      },
      {
        path: 'entity/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entities/edit-entities/edit-entities.module').then(m => m.EditEntitiesModule)
      },
      {
        path: 'entity/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entities/create-entities/create-entities.module').then(m => m.CreateEntitiesModule)
      },
      {
        path: 'entity/showData/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entities/entity-tables/entity-tables.module').then(m => m.EntityTablesModule)
      },
      {
        path: 'entity/linkForm/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entities/link-form/link-form.module').then(m => m.LinkFormModule)
      },
      {
        path: 'entityView', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entity-views/entity-views.module').then(m => m.EntityViewsModule)
      },
      {
        path: 'entityView/create/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entity-views/create-entity-views/create-entity-views.module').then(m => m.CreateEntityViewsModule)
      },
      {
        path: 'entityView/edit/:entityId/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entity-views/edit-entity-views/edit-entity-views.module').then(m => m.EditEntityViewsModule)
      },
      {
        path: 'entityView/showData/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entity-views/entity-view-table/entity-view-table.module').then(m => m.EntityViewTableModule)
      },
      {
        path: 'tags', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/tags/tags.module').then(m => m.TagsModule)
      },
      {
        path: 'tags/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/tags/edit-tags/edit-tags.module').then(m => m.EditTagsModule)
      },
      {
        path: 'tagType', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/tag-type/tag-type.module').then(m => m.TagTypeModule)
      },
      {
        path: 'tagType/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/tag-type/edit-tag-type/edit-tag-type.module').then(m => m.EditTagTypeModule)
      },
      {
        path: 'referrals', canActivate: [AuthGuard],
        data: {
          userRoles: [
            Roles.ROLE_SUPER_ADMIN,
            Roles.ROLE_ADMIN,
            Roles.ROLE_REFERRALS
          ]
        },
        loadChildren: () => import('./mis-components/referrals/referrals.module').then(m => m.ReferralsModule)
      },
      {
        path: 'create-referral', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_REFERRALS]
        },
        loadChildren: () => import('./mis-components/referrals/create-client/create-referral.module').then(m => m.CreateReferralModule)
      },
      {
        path: 'generate-referral', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_REFERRALS]
        },
        loadChildren: () => import('./mis-components/referrals/generate-referral/generate-referral.module').then(m => m.GenerateReferralModule)
      },
      { path: 'referral-edit/:id/:readonly', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_REFERRALS]
        },
        loadChildren: () => import('./mis-components/referrals/referral-edit/referral-edit.module').then(m => m.ReferralEditModule) },
      {
        path: 'action-referral/:id/:readonly', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_REFERRALS]
        },
        loadChildren: () => import('./mis-components/referrals/action-referral/action-referral.module').then(m => m.ActionReferralModule)
      },
      {
        path: 'irc-feedback-list', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_FEEDBACK]
        },
        loadChildren: () => import('./mis-components/feedback/feedback.module').then(m => m.FeedbackModule)
      },
      {
        path: 'activity-list', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/activity-report/activity-report.module').then(m => m.ActivityReportModule)
      },
      {
        path: 'activity-create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/activity-report/create-activity-report/create-activity-report.module').then(m => m.CreateActivityReportModule)
      },
      {
        path: 'activityReport/edit/:id/:readonly', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/activity-report/edit-activity-report/edit-activity-report.module').then(m => m.EditActivityReportModule)
      },
      {
        path: 'activityForm/:id/:processId/:readOnly', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/activity-report/activity-form/activity-form.module').then(m => m.ActivityFormModule)
      },
      {
        path: 'action-feedback/:id/:readOnly', canActivate: [AuthGuard],
        data: {
          userRoles: [ Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_FEEDBACK]
        },
        loadChildren: () => import('./mis-components/feedback/action-feedback/action-feedback.module').then(m => m.ActionFeedbackModule)
      },
      {
        path: 'create-feedback', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_FEEDBACK]
        },
        loadChildren: () => import('./mis-components/feedback/create-feeback/create-feedback.module').then(m => m.CreateFeedbackModule)
      },
      {
        path: 'groups', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/groups/groups.module').then(m => m.GroupsModule)
      },
      {
        path: 'group/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/groups/create-group/create-group.module').then(m => m.CreateGroupModule)
      },
      {
        path: 'group/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/groups/edit-group/edit-group.module').then(m => m.EditGroupModule)
      },
      {
        path: 'users', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'user/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/users/create-user/create-user.module').then(m => m.CreateUserModule)
      },
      {
        path: 'user/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/users/edit-user/edit-user.module').then(m => m.EditUserModule)
      },
      {
        path: 'roles', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/roles/roles.module').then(m => m.RolesModule)
      },
      {
        path: 'role/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/roles/create-role/create-role.module').then(m => m.CreateRoleModule)
      },
      {
        path: 'role/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/roles/edit-role/edit-role.module').then(m => m.EditRoleModule)
      },
      {
        path: 'scheduledTasks', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/scheduled-tasks/scheduled-tasks.module').then(m => m.ScheduledTasksModule)
      },
      {
        path: 'requestMaps', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/request-maps/request-maps.module').then(m => m.RequestMapsModule)
      },
      {
        path: 'requestMaps/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/request-maps/create-request-maps/create-request-maps.module').then(m => m.CreateRequestMapsModule)
      },
      {
        path: 'requestMaps/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/request-maps/edit-request-maps/edit-request-maps.module').then(m => m.EditRequestMapsModule)
      },
      {
        path: 'program', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program/program.module').then(m => m.ProgramModule)
      },
      {
        path: 'program/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program/create-program/create-program.module').then(m => m.CreateProgramModule)
      },
      {
        path: 'program/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program/edit-program/edit-program.module').then(m => m.EditProgramModule)
      },
      {
        path: 'programCategory', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program-category/program-category.module').then(m => m.ProgramCategoryModule)
      },
      {
        path: 'programCategory/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program-category/create-program-category/create-program-category.module').then(m => m.CreateProgramCategoryModule)
      },
      {
        path: 'programCategory/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program-category/edit-program-category/edit-program-category.module').then(m => m.EditProgramCategoryModule)
      },
      {
        path: 'milestones', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/project-milestones/project-milestones.module').then(m => m.ProjectMilestonesModule)
      },
      {
        path: 'milestones/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/project-milestones/create-project-milestones/create-project-milestones.module').then(m => m.CreateProjectMilestonesModule)
      },
      {
        path: 'milestones/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/project-milestones/edit-project-milestones/edit-project-milestones.module').then(m => m.EditProjectMilestonesModule)
      },

      {
        path: 'programStaff', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program-staff/program-staff.module').then(m => m.ProgramStaffModule)
      },
      {
        path: 'programStaff/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program-staff/create-program-staff/create-program-staff.module').then(m => m.CreateProgramStaffModule)
      },
      {
        path: 'programStaff/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [ Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/program-staff/edit-program-staff/edit-program-staff.module').then(m => m.EditProgramStaffModule)
      },

      {
        path: 'entityViewFilter', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entity-view-filters/entity-view-filters.module').then(m => m.EntityViewFiltersModule)
      },
      {
        path: 'entityViewFilter/create/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entity-view-filters/create-entity-view-filters/create-entity-view-filters.module').then(m => m.CreateEntityViewFiltersModule)
      },
      {
        path: 'entityViewFilter/edit/:entityViewId/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN]
        },
        loadChildren: () => import('./mis-components/entity-view-filters/edit-entity-view-filters/edit-entity-view-filters.module').then(m => m.EditEntityViewFiltersModule)
      },
      {
        path: 'dataView', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/data-views/data-views.module').then(m => m.DataViewsModule)
      },
      {
        path: 'dataView/create', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/data-views/create-data-views/create-data-views.module').then(m => m.CreateDataViewsModule)
      },
      {
        path: 'dataView/edit/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN]
        },
        loadChildren: () => import('./mis-components/data-views/edit-data-views/edit-data-views.module').then(m => m.EditDataViewsModule)
      },
      {
        path: 'dataView/showData/:id', canActivate: [AuthGuard],
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN, Roles.ROLE_REFERRALS, Roles.ROLE_FEEDBACK]
        },
        loadChildren: () => import('./mis-components/data-views/data-view-table/data-view-table.module').then(m => m.DataViewTableModule)
      },
      { path: 'edit-activity-report',
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/activity-report/edit-activity-report/edit-activity-report.module').then(m => m.EditActivityReportModule)
      },
      {
        path: 'activity-form',
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/activity-report/activity-form/activity-form.module').then(m => m.ActivityFormModule)
      },
      {
        path: 'irc-activity',
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/referrals/irc-activity/irc-activity-routing.module').then(m => m.IrcActivityRoutingModule)
      },
      {
        path: 'irc-feedback',
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_WORK_PLAN]
        },
        loadChildren: () => import('./mis-components/referrals/irc-activity/irc-activity-routing.module').then(m => m.IrcActivityRoutingModule)
      },
      { path: 'feedback-edit/:id/:readonly',
        data: {
          userRoles: [Roles.ROLE_SUPER_ADMIN, Roles.ROLE_ADMIN, Roles.ROLE_FEEDBACK]
        }, loadChildren: () => import('./mis-components/feedback/feedback-edit/feedback-edit.module').then(m => m.FeedbackEditModule) },
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
