import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '../../../data/services/file/file.service'
import { PortfolioService } from "../../portfolio.service";
import {FileSystemService} from "../../../data/services/file-system/file-system.service";


declare var window;

@Component({
  templateUrl: 'add-document.html'
})
export class AddDocumentModal {
  constructor(public viewCtrl: ViewController, private fileChooser: FileChooser, private filePath: FilePath,
              private portfolioservice: PortfolioService, private fileSystemService: FileSystemService) {}
  document: File = { date: new Date().toISOString() } as any;
  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectFile() {
    this.fileChooser.open()
    .then(uri => window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.getMetadata((metadata) => {
            this.filePath.resolveNativePath(uri)
              .then(filePath => {
                  this.document.path = filePath;
              }).catch(err => console.log(err));
            this.document.size = metadata.size;
        });
    }))
    .catch(err => console.log(err));
    this.fileSystemService.addFile(this.document, this.portfolioservice.getDirectory());
  }


}
