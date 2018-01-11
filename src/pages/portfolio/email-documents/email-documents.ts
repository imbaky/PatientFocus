import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavParams, ViewController, ToastController } from 'ionic-angular';
import { Directory } from '../../../core/data/services/directory/directory.service';
import { EmailComposer } from '@ionic-native/email-composer';

declare var window;

@Component({
  templateUrl: 'email-documents.html'
})

export class EmailDocumentsPage {
  directory: Directory;
  emailDocumentsForm: FormGroup;
  constructor(public viewCtrl: ViewController,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private params: NavParams,
            private emailComposer: EmailComposer) {
    this.emailDocumentsForm = this.formBuilder.group({
      to: [ 'recipient', Validators.required ],
      subject: [ 'subject', Validators.required ],
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async sendFiles() {
    const email = {
       to: this.emailDocumentsForm.controls['to'].value,
        cc: '',
        bcc: '',
        attachments: this.params.get('attachments'),
        subject : this.emailDocumentsForm.controls['subject'].value,
        body: '',
        isHtml: true
    };
    this.emailComposer.open(email);
  }
}
