import { Component } from '@angular/core';

@Component({
  selector: 'survey-button',
  templateUrl: 'survey-button.component.html'
})
export class SurveyButtonComponent {

  constructor() {
  }

  openSurvey() {
    window.open('https://goo.gl/forms/CdyiIxbwyx6ess3a2', '_system', 'location=yes');
  }

}
