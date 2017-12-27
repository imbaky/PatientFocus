import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

import { Directory, DirectoryService } from '../directory/directory.service';
import {DocumentType, FileFormatType} from '../../enum/file-type.enum';
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
   * @param newDocumentName new name associated to the document
   * @param directory user profile directory
   */
  async addNewFileToDirectory(fullPath: string, creationDate: string, type: DocumentType, newDocumentName: string, directory: Directory) {
      const filename = fullPath.substring(fullPath.lastIndexOf('/') + 1);
      const extension = filename.substring(filename.lastIndexOf('.'));
      const url = fullPath.substring(0, fullPath.lastIndexOf('/'));
      const entry = await this.file.copyFile(url, filename, this.file.dataDirectory + 'Documents/', newDocumentName.concat(extension));
      await this.directoryService.addFileToDirectory(entry, creationDate, type, directory);
      const entries = await this.file.listDir(this.file.dataDirectory, 'Documents');
  }

  addDirectoryToDevice(directory: Directory) {
    this.file.createDir(this.file.dataDirectory + 'Documents/', directory.id.toString() , false);
  }

  /**
   * Gets the file with an id.
   * @param id
   */
  getFile(item: Item) {

  }

}
