import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesComponent } from './pages.component';
import { routing } from './pages.routes';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login/login.component';
import { PagesGuard } from './pages.guard'

const PAGES_MODULE = [
  SharedModule
]

@NgModule({
  declarations: [
    PagesComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    ...PAGES_MODULE
  ],
  providers: [
    PagesGuard
  ],
  bootstrap: [PagesComponent]
})
export class PagesModule { }
