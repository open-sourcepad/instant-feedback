import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './meetings.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import {NgxPaginationModule} from 'ngx-pagination';

import { MeetingsComponent } from './meetings.component';
import { MeetingIndexComponent } from './meeting-index/meeting-index.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import { TalkingPointMenuComponent } from './talking-point-menu/talking-point-menu.component';
import { MeetingDiscussionComponent } from './meeting-discussion/meeting-discussion.component';
import { DiscussMultiFormComponent } from './discuss-multi-form/discuss-multi-form.component';
import { ReviewSummaryComponent } from './review-summary/review-summary.component';
import { MeetingActionItemsComponent } from './meeting-action-items/meeting-action-items.component';



const MODULE_COMPONENTS = [
  MeetingsComponent,
  MeetingIndexComponent,
  MeetingDetailsComponent,
  TalkingPointMenuComponent,
  MeetingDiscussionComponent,
  DiscussMultiFormComponent,
  ReviewSummaryComponent,
  MeetingActionItemsComponent,
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    Ng2LoadingSpinnerModule,
    NgxPaginationModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
  ],
})

export class MeetingsModule {}
