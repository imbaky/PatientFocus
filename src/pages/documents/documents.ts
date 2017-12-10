import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { ItemType } from '../../core/data/enum/item-type.enum';

@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html'
})
export class Documents implements OnInit {

  directory: Promise<Directory>;

  ItemType = ItemType;

  constructor(
    public navCtrl: NavController,
    private directoryService: DirectoryService)
  { }

  ngOnInit() {
    this.directory = this.directoryService.getDirectoryById(1);

    this.directory.then((directory) => {
      console.log(directory);
    });
  }

}
