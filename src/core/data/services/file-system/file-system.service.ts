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
   * @param newDocumentName new name associated to the document
   * @param directory user profile directory
   */
  async addNewFileToDirectory(fullPath: string, creationDate: string, type: DocumentType, newDocumentName: string, directory: Directory) {
      const filename = fullPath.substring(fullPath.lastIndexOf('/') + 1);
      const extension = filename.substring(filename.lastIndexOf('.'));
      const url = fullPath.substring(0, fullPath.lastIndexOf('/'));
      // TODO file needs to be added to the correct directory
      const entry = await this.file.copyFile(url, filename, this.file.externalDataDirectory, filename);
      await this.directoryService.addFileToDirectory(entry, creationDate, type, directory, newDocumentName);
      const entries = await this.file.listDir('file:///storage/emulated/0/Android/data/io.ionic.starter/', 'files');
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
