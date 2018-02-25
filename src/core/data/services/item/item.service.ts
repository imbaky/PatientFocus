import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DexieService } from '@services/dexie/dexie.service';
import { FileService } from '@services/file/file.service';
import { PortfolioType } from '@enum/file-type.enum';
import { PageType } from '@enum/page-type.enum';
import {File} from '@interfaces/file/file';
import {Item} from '@interfaces/item/item';


@Injectable()
export class ItemService {

  table: Dexie.Table<Item, number>;

  constructor(
    private dexie: DexieService,
    private file: FileService
  ) {
    this.table = this.dexie.table('item');
  }

  /**
   * Retrieves items of a specific directory
   * @param directory directory identifier
   * @returns {Item} items found in the directory
   */
  async getItemsByDirectoryId(directory: number): Promise<Item[]> {
    return await this.table.where('directory_id').equals(directory).toArray();
  }

  /**
   *  Retrieves a profile image if it exists
   * @param directory
   * @returns {Promise<any>}
   */
  async getProfileImage(directory: number): Promise<any> {
    const items = <any> await this.table.where('directory_id').equals(directory).toArray();
    for (const item of items) {
      if (item.profile_img) {
        return item;
      }
    }
    return false;
  }

  /**
   * Creates an item of type file
   * @param {File} file the file to be added to the item
   * @param {string} creationDate date in which the document should be placed
   * @param {PortfolioType} type type of medical document
   * @returns {Item}
   */
  async createItemAsFile(newFile: File, creationDate: string, directory_id: number,
                         documentName: string, specificValues: any): Promise<Item> {
    const filename = newFile.path.substring(newFile.path.lastIndexOf('/') + 1);
    let item: Item =  {
      chosen_date : creationDate, // TODO add a proper description
      file_id: newFile.id,
      file: newFile,
      title: documentName,
      page: specificValues.page,
      directory_id: directory_id
    };
    item = Object.assign(item, specificValues); // combine values
    const pk = await this.table.add(item);
    this.table.update( pk, { directory_id: directory_id});
    item.id = pk;
    return item;
  }

  /**
   * Add a new item
   * @param item item to save
   * @returns {Item}
   */
  async addItemToDB(item: Item): Promise<Item> {
    const pk = await this.table.put(item);
    this.table.update( pk, { id: pk });
    item.id = pk;
    return item;
  }

  /**
   * Update an existing item based on its key
   * @param item item to update
   * @param updates changes for a given item
   */
  async updateItem(item: Item, updates: any) {
    await this.table.update(item.id, updates);
  }

  /**
   * Return diary items associated to a profile
   * @param {number} profileId
   */
  async getDiaryItemsByProfileID(profileId: number): Promise<Item[]> {
    const items = await this.table.where('directory_id').equals(profileId).and( item => {
      if (item.page === PageType.Diary) {
        return true;
      }
      return false;
    }).toArray();
    return items;
  }

  /**
   * Append an item to the list of existing items
   * @param items existing list of items
   * @param item item to append
   */
  updateItemList(items: Item[], item: Item): Item[] {
    const newItems = [];
    items.push(item);
    items.forEach( newItem => {
      newItems.push(newItem);
    });
    items = newItems; // updates ui that an item has been added
    return items;
  }

  /**
   * Deletes an existing item based on its key
   * @param item item to delete
   */
  async deleteItem(item: Item) {
    await this.table.delete(item.id);
  }
}
