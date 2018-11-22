import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { SharedModule } from './pages/shared/shared.module';
import {
  PulseService,
  AnswerService,
  MeetingService,
  QuestionService,
  UserService
} from './services/api';
import { HttpService, LocalStorage, CommonService } from './services/utils';
import { HttpClientModule } from '@angular/common/http';


const APP_SERVICES = [
  PulseService,
  AnswerService,
  MeetingService,
  QuestionService,
  UserService,
  LocalStorage
]
const APP_PROVIDERS = [
  HttpService,
  CommonService
]



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    PagesModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule

  ],
  providers: [
    ...APP_SERVICES,
    ...APP_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
