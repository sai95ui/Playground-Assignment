import { Component, OnInit } from '@angular/core';
import { ApiService, SearchParams } from '../app/services/api-service.service';
import {QuestionnaireComponentComponent} from './questionnaire-component/questionnaire-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'fhir-app-test';
  allPatients: Array<any> = [];
  timeTakenByApi = 0;
  searchParams: SearchParams = {};
  errorsToShow: Array<ErrorStruct> = [];
  loading = false;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // this.apiService.getPatients().subscribe(
    let now = Date.now();
    this.timeTakenByApi = 0;
    this.apiService.getPatientsByBirthdate().subscribe(
      (data: any) => {
        console.log(data);
        this.allPatients = data.entry;
        this.sortPatientsByBirthDate('asc');
        this.timeTakenByApi = (Date.now()-now) / 1000;
      }
    );
  }

  sortPatientsByBirthDate(order: 'asc' | 'desc') {
    if (order === 'asc') {
      this.allPatients = this.allPatients.sort((patient1: any, patient2: any) => { 
        return (new Date(patient1.resource.birthDate).getTime() - new Date(patient2.resource.birthDate).getTime());
      });
      
    } else if (order === 'desc') {
      this.allPatients = this.allPatients.sort((patient1: any, patient2: any) => { 
        return (new Date(patient2.resource.birthDate).getTime() - new Date(patient1.resource.birthDate).getTime());
      });
    }
  }

  search() {
    if (this.loading) {
      return;
    }
    
    const errors = this.validateSearchParams();
    if (errors.length === 0) {
      this.allPatients = [];
      let now = Date.now();
      this.timeTakenByApi = 0;
      this.loading = true;
      this.apiService.search(this.searchParams).subscribe(
        (data: any) => {
          console.log('SEARCH DATA: ', data);
          this.allPatients = data.entry;
          this.timeTakenByApi = (Date.now()-now) / 1000;
          this.loading = false;
        },
        (error) => {
          this.timeTakenByApi = (Date.now()-now) / 1000;
          this.loading = false;
        }
      );
    }
    this.errorsToShow = errors;
  }

  validateSearchParams(): Array<ErrorStruct> {
    // // params are optional hence, default validation value is true
    // let isNameAlphabet = true;
    // let isValidDateFormat = true;
    // let isValidDateValue = true;

    const errors: Array<ErrorStruct> = [];

    if (this.searchParams.name) {
      if ( ! /^[A-Za-z\s]+$/.test(this.searchParams.name)) {
        errors.push({ message: 'Name should contains alphabets only'});
      }
    }

    if (this.searchParams.birthDate) {
      if( ! /^\d{4}[-]\d{2}[-]\d{2}$/.test(this.searchParams.birthDate)) {
        errors.push({ message: 'Birth Date should be in format YYYY-MM-DD'});
      }
      const date = new Date(this.searchParams.birthDate);
      if (isNaN(date.getTime())) {
        errors.push({ message: 'Birth Date should be a Valid Date'});
      }
    }

    return errors;
  }

  resetSearch() {
    this.searchParams = {};
    this.errorsToShow = [];
  }

}

interface ErrorStruct {
  message: string;
}
