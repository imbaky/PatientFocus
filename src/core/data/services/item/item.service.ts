import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DexieService } from '../dexie/dexie.service';
import { FileService, File } from '../file/file.service';
import { ItemType } from '../../enum/item-type.enum';
import { DocumentType } from '../../enum/file-type.enum';
import { PageType } from "../../enum/page-type.enum";

export interface Item {
  id?: number;
  title?: string;
  description?: string;
  //type?: ItemType;
  file_id?: number;
  page?: PageType; //specifies which page item belongs to
  chosen_date?: string;
  document_type?: DocumentType;
  user_defined_file_name?: string;
  file?: File; // TODO change field to file and remove directory
}

@Injectable()
export class ItemService {

  table: Dexie.Table<Item, number>;

  constructor(
    private dexie: DexieService,
    private file: FileService
  ) {
    this.table = this.dexie.table('item');
  }

  async getItemsByDirectoryId(directory: number): Promise<Item[]> {
    const items = await this.table.where('directory_id').equals(directory).toArray();
    let files = [];

    items.forEach((item) => {
      if (item.file) {
        files.push(item.file_id);
      }
    });

    files = await this.file.getFilesByIds(files);

    items.forEach((item) => {
      if (item.file) {
        item.file = files.find((file) => item.file_id === file.id);
      }
    });

    return items;
  }

  /**
   * Creates an item of type file
   * @param {File} file the file to be added to the item
   * @param {string} creationDate date in which the document should be placed
   * @param {DocumentType} type type of medical document
   * @returns {Item}
   */
  async createItemAsFile(newFile: File, creationDate: string, directory_id: number, documentName: string, specificValues: any): Promise<Item> {
    const filename = newFile.path.substring(newFile.path.lastIndexOf('/') + 1);
    let item: Item =  {
      chosen_date : creationDate,
      description: 'Temporary description', // TODO add a proper description
      file_id: newFile.id,
      file: newFile,
      user_defined_file_name: documentName
    };
    item = Object.assign(item, specificValues); // combine values
    const pk = await this.table.add(item);
    this.table.update( pk, { directory_id: directory_id});
    item.id = pk;
    return item;
  }

  async addItemToDB(item: Item) : Promise<Item> {
    const pk = await this.table.add(item);
    this.table.update( pk, { id: pk});
    item.id = pk;
    return item;
  }

  async updateItem(item: Item, updates: any) { //replace old item
    this.table.update(item.id, updates);
  }
}
