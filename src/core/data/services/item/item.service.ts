import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

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
  created_at: string;
  value: Directory | File;
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
      if (item.type === ItemType.FILE) {
        files.push(item.id);
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

}
