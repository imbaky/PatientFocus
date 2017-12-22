import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { ItemType } from '../../core/data/enum/item-type.enum';
import { DocumentType, FileFormatType, documentValues, fileFormatValues } from '../../core/data/enum/file-type.enum';
import { Item } from '../../core/data/services/item/item.service';

@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html'
})
export class Documents {

  directory$: Promise<Directory>;

  currentItem: Item;
  documentValues = documentValues;
  fileFormatValues = fileFormatValues;

  ItemType = ItemType;
  Document_Type = DocumentType;
  FileFormat_Type = FileFormatType;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private directoryService: DirectoryService
  ) {
    this.currentItem = this.navParams.get('item');

    // TODO: get current profile directory id, currently set to 1.
    const id = (!this.currentItem) ? 1 : this.currentItem.type_id;

    this.directory$ = this.directoryService.getDirectoryById(id);
  }

  handleDir(event, item) {
    // pass selected item to page
    this.navCtrl.push(Documents, { item: item });
  }

}
