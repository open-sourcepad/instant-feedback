import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './responses.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponsesComponent } from './responses.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';

import { Daterangepicker } from 'ng2-daterangepicker';


const MODULE_COMPONENTS = [
  ResponsesComponent,
  SearchFiltersComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker
  ],
  declarations: [
    ...MODULE_COMPONENTS
  ],
})

export class ResponsesModule {}
