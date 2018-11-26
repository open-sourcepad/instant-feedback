import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './meetings.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import {NgxPaginationModule} from 'ngx-pagination';

import { MeetingsComponent } from './meetings.component';
import { MeetingIndexComponent } from './meeting-index/meeting-index.component';



const MODULE_COMPONENTS = [
  MeetingsComponent,
  MeetingIndexComponent
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
