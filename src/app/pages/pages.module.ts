import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { routing } from './pages.routes';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';

const PAGES_MODULE = [
  SharedModule
]

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    routing,
    ...PAGES_MODULE
  ],
  providers: [],
  bootstrap: [PagesComponent]
})
export class PagesModule { }
