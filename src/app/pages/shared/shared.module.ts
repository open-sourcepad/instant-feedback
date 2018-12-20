import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ModalComponent } from './modal/modal.component';
import { BackButtonComponent } from './back-button/back-button.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

const SHARED_COMPONENTS = [
  NavbarComponent,
  ModalComponent,
  BackButtonComponent,
  PaginationComponent,
  SideMenuComponent
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ...SHARED_COMPONENTS,
  ],
  exports: [
    ...SHARED_COMPONENTS,
  ],
  providers: [
  ]
})

export class SharedModule {}
