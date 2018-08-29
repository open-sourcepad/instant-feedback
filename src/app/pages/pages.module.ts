import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { routing } from './pages.routes';
import { CommonModule } from '@angular/common';


const PAGES_MODULE = [
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
