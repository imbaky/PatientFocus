import { Injectable } from '@angular/core';
import { Entry } from '@ionic-native/file';
import Dexie from 'dexie';

import { DexieService } from '../dexie/dexie.service';
import { Item, ItemService } from '../item/item.service';
import { DocumentType } from '../../enum/file-type.enum';
import { FileService } from '../file/file.service';

export interface Directory {
  id?: number;
  items: Item[];
}

@Injectable()
export class DirectoryService {

  table: Dexie.Table<Directory, number>;

  constructor(
    private dexie: DexieService,
    private items: ItemService,
    private fileService: FileService
  ) {
    this.table = this.dexie.table('directory');
  }

  /**
   * Creates a new directory with a given id
   * @param id - profile id
   * @returns {Promise<number>}
   */
  async createNewDirectory(id: number) {
    return await this.dexie.table('directory').add({id: id});
  }

  /**
   * Returns content items of a directory
   * @param id
   * @returns {Promise<Directory>}
   */
  async getDirectoryById(id: number): Promise<Directory> {
    const directory = await this.table.get(id);
    directory.items = await this.items.getItemsByDirectoryId(directory.id);

    return directory;
  }

  /**
   * Returns the directory objects.
   * @param ids
   * @returns {Promise<Directory[]>}
   */
  async getDirectoriesByIds(ids: number[]): Promise<Directory[]> {
    const directories = ids.map(id => this.table.get(id));

    return Promise.all(directories);
  }

  /**
   * Adds a file to a directory
   * @param {Entry} fileEntry file to be added to the directory
   * @param {string} creationDate Date in which the document should be placed
   * @param {DocumentType} type type of medical document
   * @param {Directory} directory the directory in which the file will be added to
   */
  async addFileToDirectory(fileEntry: Entry, creationDate: string, type: DocumentType, directory: Directory,
                           newDocumentName: string) {
    fileEntry.getMetadata(async (metadata) => {
      const size = metadata.size;
      const newFile = await this.fileService.createFile(fileEntry.nativeURL, size, type, newDocumentName);
      const item = await this.items.createItemAsFile(newFile, creationDate, type, directory.id);
      directory.items.push(item);
      const newItems = [];
      directory.items.forEach( (newItem) => newItems.push(newItem));
      directory.items = newItems;
    });
  }

}
