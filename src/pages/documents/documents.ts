import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { ItemType } from '../../core/data/enum/item-type.enum';

@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html'
})
export class Documents implements OnInit {

  directory$: Promise<Directory>;
  selectedItem: any;
  dirLevel: any;

  ItemType = ItemType;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private directoryService: DirectoryService
  ) {
      this.selectedItem = navParams.get('item');
      if (typeof this.selectedItem === 'undefined') {
        this.dirLevel = 1;
      } else if (this.selectedItem.type === ItemType.DIRECTORY) {
          this.dirLevel = this.selectedItem.directory_id + 1;
      }
  }

  ngOnInit() {
    this.directory$ = this.directoryService.getDirectoryById(this.dirLevel);

    this.directory$.then((directory) => {
      console.log(directory);
    });
  }

  handleDir(event, item) {
    // pass selected item to page
    this.navCtrl.push(Documents, {item: item});
  }
}
