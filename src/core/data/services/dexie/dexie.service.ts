import { Injectable } from '@angular/core';

import Dexie from 'dexie';
import { ItemType } from '../../enum/item-type.enum';

@Injectable()
export class DexieService extends Dexie {

  constructor() {
    super('store');

    this.version(1).stores({
      'directory': '++id',
      'profile': '++id, directory',
      'item': '++id, name, type, type_id, directory_id',
      'file': '++id, path, size'
    });

    this.on('populate', () => {
      this.table('profile').add({
        directory: 1
      });
      this.table('directory').bulkAdd([
        { id: 1 },
        { id: 2 },
      ]);
      this.table('item').bulkAdd([
        {
          name: 'Filename1.txt',
          description: 'lab test1',
          type: ItemType.FILE,
          type_id: 1,
          directory_id: 1
        },
        {
          name: 'Filename11.txt',
          description: 'lab test2',
          type: ItemType.FILE,
          type_id: 1,
          directory_id: 1
        },
        {
          name: 'Sub Folder1',
          description: '',
          type: ItemType.DIRECTORY,
          type_id: 1,
          directory_id: 1
        },
        {
          name: 'Filename2.txt',
          description: 'blood test',
          type: ItemType.FILE,
          type_id: 1,
          directory_id: 2
        },
      ]);
      this.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 4576543
        }
      ]);
    });
    
  }
}
