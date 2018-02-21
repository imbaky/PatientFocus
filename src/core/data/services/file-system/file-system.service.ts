import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Directory, DirectoryService } from '@services/directory/directory.service';
import { Item } from '@services/item/item.service';
import * as jszip from 'jszip';

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
   * @param newDocumentName new name associated to the document
   * @param directory user profile directory
   * @param specificValues module specific values
   */
  async addNewFileToDirectory(fullPath: string, creationDate: string, newDocumentName: string,
                              directory: Directory, specificValues: any): Promise<Item> {
      const filename = fullPath.substring(fullPath.lastIndexOf('/') + 1);
      const url = fullPath.substring(0, fullPath.lastIndexOf('/'));
      // TODO file needs to be added to the correct directory
      const newFileName: string = await this.createFileName(filename, directory);
      const entry = await this.file.copyFile(url, filename, this.file.externalDataDirectory + '/' + String(directory.id), newFileName);
      return await this.directoryService.addFileToDirectory(entry, creationDate, directory, newDocumentName, specificValues);
  }

  /**
   * Edits file and item deletion in dexie data repository and updates file from external data directory
   * @param fullPath path of where the original file is located
   * @param creationDate in which the document should be placed
   * @param newDocumentName new name associated to the document
   * @param directory user profile directory
   * @param item item to edit
   * @param specificValues module specific values
   */
  async editFileFromDirectory(fullPath: string, creationDate: string, newDocumentName: string,
    directory: Directory, item: Item, specificValues: any) {
      let entry;
      const filename = fullPath.substring(fullPath.lastIndexOf('/') + 1);
      const url = fullPath.substring(0, fullPath.lastIndexOf('/'));
      const newFileName: string = await this.createFileName(filename, directory);
      if ((fullPath && item.file === undefined) || (fullPath !== item.file.path)) {
        entry = await this.file.copyFile(url, filename, this.file.externalDataDirectory + '/' + String(directory.id), newFileName);
        const newFile = await this.directoryService.addFileToDirectory(entry, creationDate, directory, newDocumentName, specificValues);
        return await this.deleteFileFromDirectory(item, directory);
      } else {
        entry = await this.file.copyFile(this.file.externalDataDirectory + '/' + String(directory.id), filename, this.file.externalDataDirectory + '/' + String(directory.id), newFileName);
        const newFile = await this.directoryService.addFileToDirectory(entry, creationDate, directory, newDocumentName, specificValues);
        const removeResult = await this.file.removeFile(this.file.externalDataDirectory + '/' + String(directory.id), filename);
        if (removeResult.success) {
          await this.directoryService.deleteItem(item, directory);
          return await true;
        } else {
          console.error('Failed to remove file from external directory');
          return await false;
        }
      }
  }

  /**
   * Deletes file from external data directory and proceeds with file and item deletion in dexie data repository
   * @param item item to delete
   * @param directory user profile directory
   */
  async deleteFileFromDirectory(item: Item, directory: Directory): Promise<boolean> {
    try {
      if (item.file) {
        const result = await this.file.removeFile(this.file.externalDataDirectory + '/' + String(directory.id), item.file.file_name);
      }
      const result = await this.directoryService.deleteItem(item, directory);
    } catch (e) {
      console.error('Failed to remove file from external directory');
      return await false;
    }
  }

  /**
   * Creates a name for the file while handling existing names in the directory
   * @param originalFileName name of the file
   * @param directory user profile directory
   */
  async createFileName(originalFileName: string, directory: Directory): Promise<string> {
    let newFileName: string = originalFileName;
    const extension = newFileName.substring(newFileName.lastIndexOf('.'));
    const index = newFileName.lastIndexOf(extension);
    const name_without_extension: string = newFileName.slice(0, index);
    newFileName = name_without_extension;
    for (let _i = 1; _i <= directory.items.length; _i++) {
      try {
        const found = await this.file.checkFile(this.file.externalDataDirectory + String(directory.id) + '/',
          newFileName.concat(extension));
        if (found) {
          newFileName = name_without_extension;
          newFileName = newFileName.concat('_' + _i.toString());
        } else {
          break;
        }
      } catch (e) {
        console.log('error', e);
        break; // file not found
      }
    }
    newFileName = newFileName.concat(extension);
    return newFileName;
  }

  /**
   * Create new director for user
   * @param profileId associated user's profile identifier
   */
  async createNewDirectory(profileId: number) {
    try {
      await this.file.createDir(this.file.externalDataDirectory + '/', String(profileId), false);
    } catch (e) {
      console.log(e);
    }
    return await this.directoryService.createNewDirectory(profileId);
  }
}
