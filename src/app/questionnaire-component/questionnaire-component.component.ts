import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api-service.service';
// import questionnaire from "../../assets/questionnaire.json";

@Component({
  selector: 'app-questionnaire-component',
  templateUrl: './questionnaire-component.component.html',
  styleUrls: ['./questionnaire-component.component.scss']
})
export class QuestionnaireComponentComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  fg: FormGroup;
  item: any;

  ngOnInit(): void {

    this.apiService.getJSON().subscribe(
      (data: any) => {
        this.item = data.item;

        this.generateForm();

      },
      (error) => {
        console.log(error);
      },
    );
  }
  generateForm() {
    // const qKeys = Object.keys(item);

    let formControlls: any = {}; //: Array<FormControl> = [];

    this.item.forEach(itemData => {
      if (itemData.type === 'group') {
        formControlls[itemData.linkId] = new FormGroup(itemData.text);
        itemData.item.forEach(innerItem => {
          formControlls[itemData.linkId][innerItem.linkId] = new FormControl(innerItem.text);
        });  
      }
      formControlls[itemData.linkId] = new FormControl(itemData.text);
    });

    this.fg = new FormGroup(formControlls);

  }

}

