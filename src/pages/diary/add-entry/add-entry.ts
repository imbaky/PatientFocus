import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ViewController, NavParams, ToastController } from 'ionic-angular';
import * as moment from 'moment';

import { ItemService, Item } from '../../../core/data/services/item/item.service';
import { File, FileService } from '../../../core/data/services/file/file.service';
import { FileSystemService } from '../../../core/data/services/file-system/file-system.service';
import { Directory} from '../../../core/data/services/directory/directory.service';
import { PageType } from '../../../core/data/enum/page-type.enum';

@Component({
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {
  addEntryForm: FormGroup;
  directory: Directory;
  imgSrc: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private fileChooser: FileChooser,
    public viewCtrl: ViewController,
    private itemService: ItemService,
    private filePath: FilePath,
    private fileSystemService: FileSystemService,
    private params: NavParams,
    private fileService: FileService,
    private camera: Camera
  ) {
    this.addEntryForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.directory = this.params.get('directory');
    // this.imgSrc = 'http://lorempixel.com/400/200/';
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

  async takePicture() {
    try {
      this.imgSrc = await this.camera.getPicture(this.OPTIONS);
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

  async selectFile() {
    const uri = await this.fileChooser.open();
      window.resolveLocalFileSystemURL(uri, (fileEntry) => {
          fileEntry.getMetadata(async (metadata) => {
              // this.importDocumentForm.controls['fullPath'].setValue(await this.filePath.resolveNativePath(uri));
              this.imgSrc = await this.filePath.resolveNativePath(uri);
              console.log(this.imgSrc);
          });
      });
  }

  async addEntry() {
    console.log(moment().format('YYYY-MM-DD'));
    console.log(this.addEntryForm.controls['title'].value);
    console.log(this.addEntryForm.controls['description'].value);
    // TODO add diary specific entires in item ex item.feelings = feelings ...
    const specificValues = {
      page: PageType.Diary
    };
    if (this.imgSrc) {
      const itemWithFile = await this.fileSystemService.addNewFileToDirectory('selectedFilePath', 'creationDate',
        'document name', this.directory, specificValues);
    } else {
      const item = {
        title: this.addEntryForm.controls['title'].value,
        description: this.addEntryForm.controls['description'].value,
        chosen_date: moment().format('YYYY-MM-DD'),
        page: specificValues.page
      };
      await this.itemService.addItemToDB(item);
    }
  }
}
