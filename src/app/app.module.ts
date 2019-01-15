import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { SharedModule } from './pages/shared/shared.module';
import {
  PulseService,
  AnswerService,
  ActionItemService,
  DiscussionService,
  FeedbackService,
  MeetingService,
  MyMeetingService,
  QuestionService,
  SessionService,
  TalkingPointService,
  UserService,
  UserQuestionService
} from './services/api';
import { HttpService, LocalStorage, CommonService, AppSettings, RoutingState } from './services/utils';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const APP_SERVICES = [
  PulseService,
  AnswerService,
  ActionItemService,
  DiscussionService,
  FeedbackService,
  MeetingService,
  MyMeetingService,
  QuestionService,
  SessionService,
  TalkingPointService,
  UserService,
  UserQuestionService,
  LocalStorage,
  AppSettings,
  RoutingState
]
const APP_PROVIDERS = [
  HttpService,
  CommonService
]



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
