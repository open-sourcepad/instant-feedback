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
import { datePrettyFormat } from 'src/app/services/pipes/date-pretty-format.pipe';
import { FeedbackMenuComponent } from './feedback-menu/feedback-menu.component';
import { limitChar } from 'src/app/services/pipes/limit-char.pipe';

const SHARED_COMPONENTS = [
  NavbarComponent,
  ModalComponent,
  BackButtonComponent,
  PaginationComponent,
  SideMenuComponent,
  FeedbackMenuComponent
]

const SHARED_PIPES = [
  datePrettyFormat,
  limitChar
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
    ...SHARED_PIPES,
  ],
  exports: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
  ],
  providers: [
  ]
})

export class SharedModule {}
