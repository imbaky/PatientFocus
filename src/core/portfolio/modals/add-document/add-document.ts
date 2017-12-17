import { Component } from '@angular/core';
import { NavParams, ViewController} from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileSystemService} from "../../../data/services/file-system/file-system.service";
import { Directory } from "../../../data/services/directory/directory.service";

declare var window;

@Component({
  templateUrl: 'add-document.html'
})
export class AddDocumentModal {

  directory: Directory;
  date: string = new Date().toISOString();
  fullPath: string;
  newFileName: string = new Date().toISOString(); //TODO Darrel need to add input to change file name. original file name is a number
  documentType: string = "Lab"; //TODO


  constructor(public viewCtrl: ViewController,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileSystemService: FileSystemService,
              private params: NavParams) {

    this.directory = this.params.get('directory');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectFile() {
    this.fileChooser.open()
    .then(uri => window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.getMetadata((metadata) => {
            this.filePath.resolveNativePath(uri)
              .then(fullPath => {
                this.fullPath = fullPath;
              }).catch(err => console.log(err));
        });
    }))
    .catch(err => console.log(err));
  }

  importFile() { //TODO need import button
    this.fileSystemService.addFile(this.fullPath, this.date, this.documentType, this.directory);
  }


}
