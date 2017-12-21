import { Injectable } from '@angular/core';
import { Entry } from '@ionic-native/file';

import Dexie from 'dexie';

import { DexieService } from '../dexie/dexie.service';
import { FileService, File } from '../file/file.service';
import { ItemType } from '../../enum/item-type.enum';
import { Directory } from '../directory/directory.service';
import { DocumentType } from '../../enum/file-type.enum';

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
   * @param {string} creationDate date in which the document should be placed
   * @param {DocumentType} type type of medical document
   * @returns {Item}
   */
  async createItemWithFileEntry(fileEntry: Entry, creationDate: string, type: DocumentType, directory_id: number): Promise<Item> {
    let size;
    await fileEntry.getMetadata(metadata => {
      size = metadata.size;
    });
    const file: File = await this.file.createFile(fileEntry.nativeURL, size, type);
    const item: Item =  {
      name: fileEntry.name,
      effective : creationDate,
      description: "Temporary description",
      type: ItemType.FILE,
      type_id: file.id,
      value: file
    };
    const pk = await this.table.add(item);
    this.table.update( item.id, { directory_id: directory_id});
    item.id = pk;
    console.log(item);
    return item;
  }

}
