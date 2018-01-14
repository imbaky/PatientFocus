import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavParams, ViewController, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileSystemService } from '../../../core/data/services/file-system/file-system.service';
import { Directory } from '../../../core/data/services/directory/directory.service';
import { DocumentType } from '../../../core/data/enum/file-type.enum';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadType } from '../../../core/data/enum/upload-type.enum';
import * as moment from 'moment';

declare var window;

export interface DocumentTypeOption {
  name: string;
  value: DocumentType;
}

@Component({
  templateUrl: 'import-document.html'
})
export class ImportDocumentPage {
  documentTypes: Array<DocumentTypeOption> = [];
  directory: Directory;
  importDocumentForm: FormGroup;
  importMethod: string;
  constructor(public viewCtrl: ViewController,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileSystemService: FileSystemService,
              private params: NavParams,
              private camera: Camera,
            private file: File) {
    this.documentTypes = [
      { name: 'Blood Test', value: DocumentType.BLOOD_TEST },
      { name: 'Prescription', value: DocumentType.PRESCRIPTION },
      { name: 'Lab Test', value: DocumentType.LAB_TEST },
      { name: 'Consultation', value: DocumentType.CONSULTATION },
      { name: 'Image Report', value: DocumentType.IMAGE },
      { name: 'Discharge Summary', value: DocumentType.DISCHARGE },
      { name: 'Diagnosis Report', value: DocumentType.DIAGNOSIS },
      { name: 'Other', value: DocumentType.OTHER },
    ];
    this.importDocumentForm = this.formBuilder.group({
      name: [ 'Medical Document', Validators.required ],
      date: [ moment().format('YYYY-MM-DD'), Validators.required ],
      type: [ DocumentType.LAB_TEST, Validators.required ],
      fullPath: [ '', Validators.required ]
    });
    this.directory = this.params.get('directory');
    this.importMethod = this.params.get('method');
    this.selectFile();
  }

  readonly OPTIONS: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async selectFile() {
   if (this.importMethod === UploadType.ImportFile) {

      const uri = await this.fileChooser.open();
      window.resolveLocalFileSystemURL(uri, (fileEntry) => {
          fileEntry.getMetadata(async (metadata) => {
              this.importDocumentForm.controls['fullPath'].setValue(await this.filePath.resolveNativePath(uri));
          });
      });

    } else if (this.importMethod === UploadType.TakePicture) {
      // takes picture
      try {
      this.importDocumentForm.controls['fullPath'].setValue(await this.camera.getPicture(this.OPTIONS));
      } catch (err) {
                 // shows error as a toast
                 const errToast = this.toastCtrl.create({
                  message: `Error: ${err} while taking photo`,
                  duration: 3000,
                  position: 'bottom'
                }).present();
      }
    }

  }

  async importFile() {
    await this.fileSystemService.addNewFileToDirectory(
      this.importDocumentForm.controls['fullPath'].value,
      this.importDocumentForm.controls['date'].value,
      this.importDocumentForm.controls['type'].value,
      this.importDocumentForm.controls['name'].value,
      this.directory
    );
    const importToast = this.toastCtrl.create({
      message: `${this.importDocumentForm.controls['name'].value} was successfully imported`,
      duration: 3000,
      position: 'bottom'
    });
    await importToast.present();
    this.viewCtrl.dismiss();
  }
}
