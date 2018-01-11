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
    let email = {
       to: ''
    }
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
}
