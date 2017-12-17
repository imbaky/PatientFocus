import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';
import { Entry } from "@ionic-native/file";

import Dexie from 'dexie';

import { FileService, File } from '../file/file.service';
import { ItemType } from '../../enum/item-type.enum';
import { Directory } from '../directory/directory.service';

export interface Item {
  id?: number;
  name: string;
  description: string;
  type: ItemType;
  type_id: number;
  effective: string;
  value: Directory | File;
}

@Injectable()
export class ItemService {

  table: Dexie.Table<Item, number>;

  constructor(
    private dexie: DexieService,
    private file: FileService,
  ) {
    this.table = this.dexie.table('item');
  }

  async getItemsByDirectoryId(directory: number): Promise<Item[]> {
    const items = await this.table.where('directory_id').equals(directory).toArray();

    let files = [];

    items.forEach((item) => {
      if (item.type === ItemType.FILE) {
        files.push(item.type_id);
      }
    });

    files = await this.file.getFilesByIds(files);

    items.forEach((item) => {
      if (item.type === ItemType.FILE) {
        item.value = files.find((file) => item.type_id === file.id);
      }
    });

    return items;
  }

  /**
   * Creates an item of type file
   * @param {Entry} fileEntry the file to be added to the item
   * @param {string} creationDate Date in which the document should be placed)
   * @param {string} type The type of the file
   * @returns {Item}
   */
  createItemWithFileEntry(fileEntry: Entry, creationDate: string, type: string): Item { //TODO need to return Promise<Item>
    var item : Item = { } as any;
    fileEntry.getMetadata(metadata => {
      item.created = creationDate;
      this.file.createFile(fileEntry.nativeURL, metadata.size, type);
    })
    this.table.add(item);
    return item;
  }
}
