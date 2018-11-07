import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './questions.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Daterangepicker } from 'ng2-daterangepicker';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';

import { QuestionsComponent } from './questions.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { QuestionIndexComponent } from './question-index/question-index.component';


import { DateSuffix } from '../../services/pipes/date-suffix.pipe';



const MODULE_COMPONENTS = [
  QuestionsComponent,
  QuestionDetailsComponent,
  QuestionIndexComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    Ng2LoadingSpinnerModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
    DateSuffix
  ],
})

export class QuestionsModule {}
