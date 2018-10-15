import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './responses.routing';
import { FormsModule } from '@angular/forms';

import { ResponsesComponent } from './responses.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';


const MODULE_COMPONENTS = [
  ResponsesComponent,
  SearchFiltersComponent
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

export class ResponsesModule {}
