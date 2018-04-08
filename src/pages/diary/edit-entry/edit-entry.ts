import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavParams, ToastController, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { Directory } from '@interfaces/directory/directory';
import { FileSystemService } from '@services/file-system/file-system.service';
import { File } from '@ionic-native/file';
import { ItemService } from '@services/item/item.service';
import { Item } from '@interfaces/item/item';
import { PageType } from '@enum/page-type.enum';
import * as moment from 'moment';

@Component({
  selector: 'edit-entry',
  templateUrl: 'edit-entry.html'
})
export class EditEntryPage {
  editEntryForm: FormGroup;
  directory: Directory;
  item: Item;
  imgSrc: string;

  constructor(
    private formBuilder: FormBuilder,
    private params: NavParams,
    public viewCtrl: ViewController,
    private camera: Camera,
    private toastCtrl: ToastController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private fileSystemService: FileSystemService,
    private itemService: ItemService,
    private file: File
  ) {
    this.editEntryForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.directory = this.params.get('directory');
    this.item = this.params.get('item');
    this.displayEntryValues(this.item);
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

  clearImg() {
    this.imgSrc = '';
  }

  /**
   * Reads diary entry information and displays it accordingly
   * @param item Diary entry to display
   */
  displayEntryValues(item: Item) {
    if (item.file) {
      this.editEntryForm.patchValue({
        title: this.item.title,
        description: this.item.description,
        chosen_date: this.item.chosen_date
      });
      this.imgSrc = this.item.file.path;
    } else {
      this.editEntryForm.patchValue({
        title: this.item.title,
        description: this.item.description,
        chosen_date: this.item.chosen_date
      });
    }
  }

  /**
   * Take and select picture from device camera
   * @param event Tap event
   */
  async takePicture(event?: any) {
    if (event) {
      event.preventDefault();
    }
    try {
      const pictureSrc = await this.camera.getPicture(this.OPTIONS);
      this.imgSrc = pictureSrc;
    } catch (err) {
      const errToast = this.toastCtrl
        .create({
          message: `Error: ${err} while taking photo`,
          duration: 3000,
          position: 'bottom'
        })
        .present();
    }
  }

  /**
   * Select new file from device directory
   * @param event Tap event
   */
  async selectFile(event?: any) {
    if (event) {
      event.preventDefault();
    }
    const uri = await this.fileChooser.open();
    window.resolveLocalFileSystemURL(uri, fileEntry => {
      fileEntry.getMetadata(async metadata => {
        const pictureSrc = await this.filePath.resolveNativePath(uri);
        this.imgSrc = pictureSrc;
      });
    });
  }

  /**
   * Handle edit of diary entry. If entry has a imgSrc,
   * it will modify related within the directory. Otherwise, it
   * will simply update the title, date or description.
   * */
  async editEntry() {
    let result;
    if (this.imgSrc) {
      // Edit diary entry with file
      result = await this.fileSystemService.editFileFromDirectory(
        this.imgSrc,
        moment().format('YYYY-MM-DD'),
        this.editEntryForm.controls['title'].value,
        this.directory,
        this.item,
        {
          description: this.editEntryForm.controls['description'].value,
          page: PageType.Diary
        }
      );
    } else {
      // Remove an existing file attachment from a diary entry
      if (this.item.file) {
        result = await this.file.removeFile(
          this.file.externalDataDirectory + '/' + String(this.directory.id),
          this.item.file.file_name
        );
      }
      // Edit diary entry without file
      result = await this.itemService.updateItem(this.item, {
        title: this.editEntryForm.controls['title'].value,
        chosen_date: moment().format('YYYY-MM-DD'),
        description: this.editEntryForm.controls['description'].value,
        file: null,
        file_id: null
      });
    }
    const importToast = this.toastCtrl.create({
      message: `${
        this.editEntryForm.controls['title'].value
      } was successfully modified`,
      duration: 3000,
      position: 'bottom'
    });
    await importToast.present();
    this.viewCtrl.dismiss();
  }
}
