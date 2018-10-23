import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { QuestionsComponent } from './questions.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { QuestionIndexComponent } from './question-index/question-index.component';

export const routes: Routes = [
  {
    path: '',
    component: QuestionsComponent,
    children: [
      { path: '', component: QuestionIndexComponent },
      { path: '/add', component: QuestionDetailsComponent },
      { path: ':id', component: QuestionDetailsComponent }
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

