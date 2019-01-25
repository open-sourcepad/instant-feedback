import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './responses.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResponsesComponent } from './responses.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';

import { Daterangepicker } from 'ng2-daterangepicker';
import {NgxPaginationModule} from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';


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
    Daterangepicker,
    NgxPaginationModule,
    Ng2LoadingSpinnerModule,
    SharedModule
  ],
  declarations: [
    ...MODULE_COMPONENTS
  ],
})

export class ResponsesModule {}
