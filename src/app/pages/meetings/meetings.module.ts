import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './meetings.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';

import { MeetingsComponent } from './meetings.component';

import { DateSuffix } from '../../services/pipes/date-suffix.pipe';
import { MeetingIndexComponent } from './meeting-index/meeting-index.component';



const MODULE_COMPONENTS = [
  MeetingsComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    Ng2LoadingSpinnerModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
    DateSuffix,
    MeetingIndexComponent
  ],
})

export class MeetingsModule {}
