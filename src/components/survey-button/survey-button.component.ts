import { Component } from '@angular/core';

@Component({
  selector: 'survey-button',
  templateUrl: 'survey-button.component.html'
})
export class SurveyButtonComponent {

  constructor() {
  }

  openSurvey() {
    const url = 'https://goo.gl/forms/CdyiIxbwyx6ess3a2';
    window.open( url, '_system', 'location=yes');
  }

}
