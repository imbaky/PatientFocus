import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

import { Directory, DirectoryService } from '../directory/directory.service';
import { DocumentType } from '../../enum/file-type.enum';
import { Item } from '../item/item.service';


declare var window;

@Injectable()
export class FileSystemService {

  constructor(
    private directoryService: DirectoryService,
    private file: File
  ) { }

  /**
   * Adds a file to a directory
   * @param fullPath path of where the original file is located
   * @param creationDate in which the document should be placed
   * @param type type of medical document
   * @param newFileName new name associated to the imported file
   * @param directory user profile directory
   */
  async addFile(fullPath: string, creationDate: string, type: DocumentType, newFileName: string, directory: Directory) {
      const filename = fullPath.substring(fullPath.lastIndexOf('/') + 1);
      var extension = filename.substring(filename.lastIndexOf("."));
      newFileName = newFileName.concat(extension);
      console.log(newFileName);
      const url = fullPath.substring(0, fullPath.lastIndexOf('/'));
      console.log(filename);
      console.log(url);
      // this.file.copyFile(url, filename, this.file.dataDirectory+"Documents/" + directory.id + "/", ""). //TODO need to add directory to phone
      const entry = await this.file.copyFile(url, filename, this.file.dataDirectory + 'Documents/', newFileName);
      console.log(entry);
      this.directoryService.addFileToDirectory(entry, creationDate, type, directory);
      const entries = await this.file.listDir(this.file.dataDirectory, 'Documents');
      console.log(entries);
  }

  /**
   * Gets the file with an id.
   * @param id
   */
  getFile(item: Item) {

  }

}
