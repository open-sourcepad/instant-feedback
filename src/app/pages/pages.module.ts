import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import { Daterangepicker } from 'ng2-daterangepicker';

import { PagesComponent } from './pages.component';
import { routing } from './pages.routes';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { PagesGuard } from './pages.guard';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { EmployeeMeetingDetailComponent } from './employee/employee-meeting-detail/employee-meeting-detail.component';

const PAGES_MODULE = [
  SharedModule
]

@NgModule({
  declarations: [
    PagesComponent,
    LoginComponent,
    UserQuestionsComponent,
    EmployeeMeetingDetailComponent
  ],
  imports: [
    CommonModule,
    Daterangepicker,
    FormsModule,
    ReactiveFormsModule,
    Ng2LoadingSpinnerModule,
    NgxPaginationModule,
    routing,
    ...PAGES_MODULE
  ],
  providers: [
    PagesGuard
  ],
  bootstrap: [PagesComponent]
})
export class PagesModule { }
