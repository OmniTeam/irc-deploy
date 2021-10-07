import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginRoutingModule} from './login-routing.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {LoginComponent} from './login.component';
import {ComponentsModule} from '../components/components.module';
import {AuthGuard} from '../guards/auth.guard';
import {AuthService} from '../services/auth.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from '../helpers/token.interceptor';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    LoginRoutingModule,
    ReactiveFormsModule

  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  declarations: [LoginComponent],
})
export class LoginModule { }
