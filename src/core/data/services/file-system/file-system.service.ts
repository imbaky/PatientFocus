import { Injectable } from '@angular/core';

import { Directory } from '../directory/directory.service';
import { Item } from '../item/item.service';

@Injectable()
export class FileSystemService {

  /**
   * Adds a file to a directory
   * @param file
   * @param directory
   */
  addFile(file: File, directory: Directory) {

  }

  /**
   * Gets the file with an id.
   * @param id
   */
  getFile(item: Item) {

  }

}
