import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import * as moment from 'moment';
//import { File as NativeFile} from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { File } from '../../../data/services/file/file.service'


declare var window;

@Component({
  templateUrl: 'add-document.html'
})
export class AddDocumentModal {
  constructor(public viewCtrl: ViewController, private fileChooser: FileChooser, private filePath: FilePath) {}
  date : String = new Date().toISOString();
  document : File;

  uri: string;

  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectFile() {
    this.fileChooser.open()
    .then(uri => window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.getMetadata((metadata) => {
            this.uri = uri;
            this.filePath.resolveNativePath(uri)
              .then(filePath => console.log(filePath))
              .catch(err => console.log(err));
        });
    }))
    .catch(err => console.log(err));
  }


}
