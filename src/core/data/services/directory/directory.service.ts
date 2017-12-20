import { Injectable } from '@angular/core';
import { File, Entry } from '@ionic-native/file';
import Dexie from 'dexie';

import { DexieService } from '../dexie/dexie.service';
import { Item, ItemService } from '../item/item.service';
import { DocumentType } from '../../enum/file-type.enum';

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
    private file: File
  ) {
    this.table = this.dexie.table('directory');
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
  async addFileToDirectory(fileEntry: Entry, creationDate: string, type: DocumentType, directory: Directory) {
    var item = await this.items.createItemWithFileEntry(fileEntry, creationDate, type, directory.id);
    directory.items.push(item);
    console.log(directory.items);
  }

  addDirectoryToDevice(directory: Directory) {
    this.file.createDir(this.file.dataDirectory + 'Documents/', directory.id.toString() , false);
  }

}
