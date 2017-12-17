import { Injectable } from '@angular/core';

import {Directory, DirectoryService} from '../directory/directory.service';
import { Item } from '../item/item.service';
import { File } from '@ionic-native/file';

declare var window;

@Injectable()
export class FileSystemService {

  constructor(
    private directoryService: DirectoryService,
    private file : File
  ) { }

  /**
   * Adds a file to a directory
   * @param fullPath path of where the original file is located
   * @param Date in which the document should be placed
   * @param directory Profile directory
   */
  addFile(fullPath: string, creationDate: string, type: string, directory: Directory) {
      console.log(fullPath);
      var filename = fullPath.substring(fullPath.lastIndexOf('/')+1); //get file name
      console.log(filename);
      var url = fullPath.substring(0, fullPath.lastIndexOf("/")); //remove filename from path
      console.log(url);
      //this.file.copyFile(url, filename, this.file.dataDirectory+"Documents/" + directory.id + "/", ""). //TODO need to add directory to phone
      this.file.copyFile(url, filename, this.file.dataDirectory+"Documents/", "").
      then( (entry) => {
        this.directoryService.addFileToDirectory(entry, creationDate, type, directory);
        this.file.listDir(this.file.dataDirectory, "Documents")
          .then( entrties => console.log(entrties))
          .catch( err => console.log("Could not list files"))
      }).catch(err => console.log(err));
  }

  /**
   * Gets the file with an id.
   * @param id
   */
  getFile(item: Item) {

  }

}
