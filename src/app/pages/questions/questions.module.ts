import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './questions.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuestionsComponent } from './questions.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { QuestionIndexComponent } from './question-index/question-index.component';

const MODULE_COMPONENTS = [
  QuestionsComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
    QuestionDetailsComponent,
    QuestionIndexComponent
  ],
})

export class QuestionsModule {}
