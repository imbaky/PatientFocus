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
import { EmailComposer } from '@ionic-native/email-composer';
import { UploadType } from '../../../core/data/enum/upload-type.enum';

declare var window;

export interface DocumentTypeOption {
  name: string;
  value: DocumentType;
}

@Component({
  templateUrl: 'email-documents.html'
})
export class EmailDocumentsPage {
  documentTypes: Array<DocumentTypeOption> = [];
  directory: Directory;
  emailDocumentsForm: FormGroup;
  importMethod: string;
  constructor(public viewCtrl: ViewController,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private fileChooser: FileChooser,
              private filePath: FilePath,
              private fileSystemService: FileSystemService,
              private params: NavParams,
            private emailComposer: EmailComposer,
            private file: File) {
    this.emailDocumentsForm = this.formBuilder.group({
      name: [ 'Medical Document', Validators.required ],
      date: [ new Date().toISOString(), Validators.required ],
      type: [ DocumentType.LAB_TEST, Validators.required ],
      fullPath: [ '', Validators.required ]
    });
    this.directory = this.params.get('directory');
    this.selectFile();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async selectFile() {
   if (this.importMethod === UploadType.ImportFile) {

      const uri = await this.fileChooser.open();
      window.resolveLocalFileSystemURL(uri, (fileEntry) => {
          fileEntry.getMetadata(async (metadata) => {
              this.emailDocumentsForm.controls['fullPath'].setValue(await this.filePath.resolveNativePath(uri));
          });
      });

    } else if (this.importMethod === UploadType.TakePicture) {
      // takes picture
      try {
      this.emailDocumentsForm.controls['fullPath'].setValue(await this.camera.getPicture(this.OPTIONS));
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
