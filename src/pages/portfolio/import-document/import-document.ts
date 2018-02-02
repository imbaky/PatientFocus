import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavParams, ViewController, ToastController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { File as NativeFile } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileSystemService } from '@services/file-system/file-system.service';
import { File } from '@services/file/file.service';
import { ItemService } from '@services/item/item.service';
import { Directory } from '@services/directory/directory.service';
import { PortfolioType } from '@enum/file-type.enum';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadType } from '@enum/upload-type.enum';
import * as moment from 'moment';
import { ItemType } from '@enum/item-type.enum';
import { PageType } from '@enum/page-type.enum';

declare var window;

export interface PortfolioTypeOption {
  name: string;
  value: PortfolioType;
}

@Component({
  templateUrl: 'import-document.html'
})
export class ImportDocumentPage {
  PortfolioTypes: Array<PortfolioTypeOption> = [];
  directory: Directory;
  importDocumentForm: FormGroup;
  importMethod: string;
  constructor(
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private fileSystemService: FileSystemService,
    private params: NavParams,
    private camera: Camera,
    private nativeFile: NativeFile,
    private itemService: ItemService
  ) {
    this.PortfolioTypes = [
      { name: 'Blood Test', value: PortfolioType.BLOOD_TEST },
      { name: 'Prescription', value: PortfolioType.PRESCRIPTION },
      { name: 'Lab Test', value: PortfolioType.LAB_TEST },
      { name: 'Consultation', value: PortfolioType.CONSULTATION },
      { name: 'Image Report', value: PortfolioType.IMAGE },
      { name: 'Discharge Summary', value: PortfolioType.DISCHARGE },
      { name: 'Diagnosis Report', value: PortfolioType.DIAGNOSIS },
      { name: 'Other', value: PortfolioType.OTHER }
    ];
    this.importDocumentForm = this.formBuilder.group({
      name: ['Medical Document', Validators.required],
      date: [moment().format('YYYY-MM-DD'), Validators.required],
      type: [PortfolioType.LAB_TEST, Validators.required],
      fullPath: ['', Validators.required]
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
      window.resolveLocalFileSystemURL(uri, fileEntry => {
        fileEntry.getMetadata(async metadata => {
          this.importDocumentForm.controls['fullPath'].setValue(
            await this.filePath.resolveNativePath(uri)
          );
        });
      });
    } else if (this.importMethod === UploadType.TakePicture) {
      try {
        this.importDocumentForm.controls['fullPath'].setValue(
          await this.camera.getPicture(this.OPTIONS)
        );
      } catch (err) {
        // shows error as a toast
        const errToast = this.toastCtrl
          .create({
            message: `Error: ${err} while taking photo`,
            duration: 3000,
            position: 'bottom'
          })
          .present();
      }
    }
  }

  async importFile() {
    const pageSpecificValues = {
      document_type: this.importDocumentForm.controls['type'].value,
      page: PageType.Portfolio
    };
    const item = await this.fileSystemService.addNewFileToDirectory(
      this.importDocumentForm.controls['fullPath'].value,
      this.importDocumentForm.controls['date'].value,
      this.importDocumentForm.controls['name'].value,
      this.directory,
      pageSpecificValues
    );

    const importToast = this.toastCtrl.create({
      message: `${
        this.importDocumentForm.controls['name'].value
      } was successfully imported`,
      duration: 3000,
      position: 'bottom'
    });
    await importToast.present();
    this.viewCtrl.dismiss();
  }
}
