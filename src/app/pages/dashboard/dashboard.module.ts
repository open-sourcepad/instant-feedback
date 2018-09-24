import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './dashboard.routing';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { TeamPulseComponent } from './team-pulse/team-pulse.component';

const MODULE_COMPONENTS = [
  DashboardComponent,
  TeamPulseComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule
  ],
  declarations: [
    ...MODULE_COMPONENTS
  ],
})

export class DashboardModule {}
