import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {
  addEntryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public viewCtrl: ViewController
  ) {
    this.addEntryForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async saveEntry() {}
}
