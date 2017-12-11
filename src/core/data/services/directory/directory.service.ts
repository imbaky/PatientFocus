import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { Item, ItemService } from '../item/item.service';

export interface Directory {
  id?: number;
  items: Item[];
}

@Injectable()
export class DirectoryService {

  table: Dexie.Table<Directory, number>;

  constructor(
    private dexie: DexieService,
    private items: ItemService
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

}
