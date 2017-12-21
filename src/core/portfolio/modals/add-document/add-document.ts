import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
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
  addDocumentForm: FormGroup;

  constructor(public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
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
    this.addDocumentForm = this.formBuilder.group({
      name: [ 'Medical Document', Validators.required ],
      date: [ new Date().toISOString(), Validators.required ],
      type: [ DocumentType.LABTEST, Validators.required ],
      fullPath: [ '', Validators.required ]
    });
    this.directory = this.params.get('directory');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async selectFile() {
    const uri = await this.fileChooser.open();
    window.resolveLocalFileSystemURL(uri, (fileEntry) => {
        fileEntry.getMetadata(async (metadata) => {
            this.addDocumentForm.controls['fullPath'].setValue(await this.filePath.resolveNativePath(uri));
        });
    });
  }

  importFile() {
    this.fileSystemService.addFile(
      this.addDocumentForm.controls['fullPath'].value,
      this.addDocumentForm.controls['date'].value,
      this.addDocumentForm.controls['type'].value,
      this.addDocumentForm.controls['name'].value,
      this.directory
    );
  }
}
