import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { DirectoryService } from '../../core/data/services/directory/directory.service';
import { directiveDef } from '@angular/core/src/view/provider';
import { digest } from '@angular/compiler/src/i18n/serializers/xmb';

@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html'
})
export class Documents {
  documents: any[];

  constructor(public navCtrl: NavController, private directory: DirectoryService) {

    this.documents = [];
    this.directory.getDirectoryById(1).then((directory) => {
      console.log(directory.items);
      for (let i = 0; i < directory.items.length; i++) {
        this.documents.push({
            name: directory.items[i].name,
            description: directory.items[i].description,
            doctype: directory.items[i].type,
            created: directory.items[i].created_at,
            file_attribs: directory.items[i].value
        });
        
      }
    });
  }

}
