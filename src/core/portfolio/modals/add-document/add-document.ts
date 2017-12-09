import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';

@Component({
  templateUrl: 'add-document.html'
})
export class AddDocumentModal {
  constructor(public viewCtrl: ViewController, private fileChooser: FileChooser) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectFile() {
    this.fileChooser.open()
    .then(uri => console.log(uri))
    .catch(e => console.log(e));
  }
}
