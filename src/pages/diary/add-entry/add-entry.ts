import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ViewController } from 'ionic-angular';
import { ItemService, Item } from '../../../core/data/services/item/item.service'
import {File, FileService} from '../../../core/data/services/file/file.service'
import { FileSystemService} from "../../../core/data/services/file-system/file-system.service";
import { NavParams } from "ionic-angular";
import { Directory} from "../../../core/data/services/directory/directory.service";
import {PageType} from "../../../core/data/enum/page-type.enum";

@Component({
  templateUrl: 'add-entry.html'
})
export class AddEntryPage {
  addEntryForm: FormGroup;
  directory: Directory;

  constructor(
    private formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    private itemService: ItemService,
    private fileSystemService: FileSystemService,
    private params: NavParams,
    private fileService: FileService
  ) {
    this.addEntryForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.directory = this.params.get('directory');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async saveEntry() { // use same ui to import files from portfolio
    let item;
    let fileSelected = false;
    // TODO add diary specific entires in item ex item.feelings = feelings ...
    let specificValues = {
      page: PageType.Diary
    }
    if(fileSelected) {
      item = await this.fileSystemService.addNewFileToDirectory("selectedFilePath", "creationDate",
        "document name", this.directory, specificValues);
    }
    else {
      // TODO add diary specific entires in here ex item.feelings = feelings ...
      item = {
        title: "title",
        description: "description",
        chosen_date: "date",
      }
      await this.itemService.addItemToDB(item);
    }
  }
}
