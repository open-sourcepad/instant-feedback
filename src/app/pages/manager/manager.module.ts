import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './manager.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxPaginationModule } from 'ngx-pagination';

import { ManagerComponent } from './manager.component';
import { ManagerOverviewComponent } from './manager-overview/manager-overview.component';
import { ManagerMeetingsComponent } from './manager-meetings/manager-meetings.component';
import { ManagerFeedbackComponent } from './manager-feedback/manager-feedback.component';

const MODULE_COMPONENTS = [
  ManagerComponent,
  ManagerOverviewComponent,
  ManagerMeetingsComponent,
  ManagerFeedbackComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    Ng2LoadingSpinnerModule,
    NgxPaginationModule,
    SharedModule
  ],
  declarations: [
    ...MODULE_COMPONENTS
  ],
})

export class ManagerModule {}
