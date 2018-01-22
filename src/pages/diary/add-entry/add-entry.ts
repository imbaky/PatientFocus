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
import { UserProfile } from '../../../core/data/services/profile/profile.service';

@Component({
  selector: 'add-entry',
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {
  addEntryForm: FormGroup;
  directory: Directory;
  items: Item[];
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
    this.items = this.params.get('items');
  }

  readonly OPTIONS: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  clearImg() {
    this.imgSrc = '';
  }

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
              this.imgSrc = await this.filePath.resolveNativePath(uri);
          });
      });
  }

  async addEntry() {
    // TODO add diary specific entires in item ex item.feelings = feelings ...
    let item: Item;
    const specificValues = {
      page: PageType.Diary,
      description: this.addEntryForm.controls['description'].value
    };
    if (this.imgSrc) {
      item = await this.fileSystemService.addNewFileToDirectory(this.imgSrc, moment().format('YYYY-MM-DD'),
        this.addEntryForm.controls['title'].value, this.directory, specificValues);
    } else {
      item = {
        title: this.addEntryForm.controls['title'].value,
        description: this.addEntryForm.controls['description'].value,
        chosen_date: moment().format('YYYY-MM-DD'),
        page: PageType.Diary,
        profile_id: this.directory.id
      };
      await this.itemService.addItemToDB(item);
    }
    const items = this.itemService.updateItemList(this.items, item); // update UI with newly added item
    this.items  = items;
    await this.closeModal();
  }

  async closeModal() {
    const successToast = this.toastCtrl.create({
      message: 'Entry was successfully added!',
      duration: 3000,
      position: 'bottom'
    });
    await successToast.present();
    this.viewCtrl.dismiss();
  }

  async errorMessage() {
    const importToast = this.toastCtrl.create({
      message: 'Failed to import file!',
      duration: 5000,
      position: 'bottom'
    });
    await importToast.present();
  }
}
