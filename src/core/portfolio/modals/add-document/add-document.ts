import { Component } from '@angular/core';
import { NavParams, ViewController} from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileSystemService} from "../../../data/services/file-system/file-system.service";
import { Directory } from "../../../data/services/directory/directory.service";
import { DocumentType } from "../../../../core/data/enum/document-type.enum";

declare var window;

export interface DocumentTypeOption {
  name: string;
  value: DocumentType;
}

@Component({
  templateUrl: 'add-document.html'
})
export class AddDocumentModal {
  documentTypes: Array<DocumentTypeOption> = [];
  directory: Directory;
  date: string = new Date().toISOString();
  fullPath: string;
  newFileName: string = new Date().toISOString(); //TODO Darrel need to add input to change file name. original file name is a number
  selectedDocumentType: DocumentType = DocumentType.LABTEST;


  constructor(public viewCtrl: ViewController,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileSystemService: FileSystemService,
              private params: NavParams) {
    this.documentTypes = [
      { name:'Lab Test', value: DocumentType.LABTEST },
      { name:'Image Report', value: DocumentType.IMAGEREPORT },
      { name:'Discharge Summary', value: DocumentType.DISCHARGESUMMARY },
      { name:'Prescription', value: DocumentType.PRESCRIPTION }
    ];
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
    this.fileSystemService.addFile(this.fullPath, this.date, this.selectedDocumentType, this.directory);
  }


}
