import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './dashboard.routing';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';

const MODULE_COMPONENTS = [
  DashboardComponent
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
