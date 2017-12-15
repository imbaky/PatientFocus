import { Injectable } from '@angular/core';

import { Directory } from '../directory/directory.service';
import { Item } from '../item/item.service';
import { File } from '../file/file.service'
import {ItemType} from "../../enum/item-type.enum";

@Injectable()
export class FileSystemService {

  /**
   * Adds a file to a directory
   * @param file
   * @param directory
   */
  addFile(file: File, directory: Directory) {
    var item: Item =  {
      name: "name",
      description: "description",
      type: ItemType.FILE,
      type_id: 1,
      created: "date",
      value: file
    };
    directory.items.push(item);
  }

  /**
   * Gets the file with an id.
   * @param id
   */
  getFile(item: Item) {

  }

}
