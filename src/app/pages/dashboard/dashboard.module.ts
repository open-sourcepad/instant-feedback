import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './dashboard.routing';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { TeamPulseComponent } from './team-pulse/team-pulse.component';

import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';

const MODULE_COMPONENTS = [
  DashboardComponent,
  TeamPulseComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    Daterangepicker,
    Ng2LoadingSpinnerModule
  ],
  declarations: [
    ...MODULE_COMPONENTS
  ],
})

export class DashboardModule {}
