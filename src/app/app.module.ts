import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {QuestionnaireComponentComponent} from './questionnaire-component/questionnaire-component.component';
import { AppComponent } from './app.component';
import { ApiService } from './services/api-service.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    QuestionnaireComponentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'fetch', pathMatch: 'full' },
      {
         path: 'quetions',
         component: QuestionnaireComponentComponent
      },
      {
        path: 'fetch',
        component: AppComponent
     }
   ])
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
