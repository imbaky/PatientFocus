import { Component } from '@angular/core';
import { NavParams, ViewController} from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileSystemService} from '../../../data/services/file-system/file-system.service';
import { Directory } from '../../../data/services/directory/directory.service';
import { DocumentType } from '../../../../core/data/enum/file-type.enum';

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
  documentName: string;
  selectedFileName: string;
  selectedDocumentType: DocumentType = DocumentType.LABTEST;

  constructor(public viewCtrl: ViewController,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileSystemService: FileSystemService,
              private params: NavParams) {
    this.documentTypes = [
      { name: 'Lab Test', value: DocumentType.LABTEST },
      { name: 'Image Report', value: DocumentType.IMAGEREPORT },
      { name: 'Discharge Summary', value: DocumentType.DISCHARGESUMMARY },
      { name: 'Prescription', value: DocumentType.PRESCRIPTION }
    ];
    this.directory = this.params.get('directory');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async selectFile() {
    const uri = await this.fileChooser.open();
    window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.getMetadata(async (metadata) => {
            this.fullPath = await this.filePath.resolveNativePath(uri);
            this.selectedFileName = this.fullPath.substring(this.fullPath.lastIndexOf('/') + 1);
        });
    });
  }

  importFile() {
    this.fileSystemService.addFile(this.fullPath, this.date, this.selectedDocumentType, this.documentName, this.directory);
  }


}
