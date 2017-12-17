import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { Item, ItemService } from '../item/item.service';
import {File, Entry} from "@ionic-native/file";

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
   * @param {string} type type of file
   * @param {Directory} directory the directory in which the file will be added to
   */

  addFileToDirectory(fileEntry: Entry, creationDate: string, type: string, directory: Directory) {
    var item : Item = this.items.createItemWithFileEntry(fileEntry, creationDate, type);
    directory.items.push(item); //TODO update directory in table
    this.table.update(directory.id, { items: directory.items });
  }

}