import { Injectable } from '@angular/core';

import Dexie from 'dexie';
import { ItemType } from '../../enum/item-type.enum';
import { SCHEMA } from './database';

@Injectable()
export class DexieService extends Dexie {

  constructor() {
    super('store');
    this.version(1).stores(SCHEMA);

    const date = new Date();
    this.on('populate', () => {
      this.table('profile').add({
        directory: 1
      });
      this.table('directory').bulkAdd([
        { id: 1 }
      ]);
      this.table('item').bulkAdd([
        {
          name: 'Filename1.txt',
          description: 'lab test1',
          type: ItemType.FILE,
          type_id: 1,
          directory_id: 1,
          created: date
        },
        {
          name: 'Filename2.txt',
          description: 'lab test2',
          type: ItemType.FILE,
          type_id: 2,
          directory_id: 1,
          created: date
        },
        {
          name: 'Filename2.txt',
          description: 'blood test',
          type: ItemType.FILE,
          type_id: 3,
          directory_id: 1,
          created: date
        },
      ]);
      this.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 4576543,
          type: 'jpeg'
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 245364,
          type: 'jpeg'
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 34564,
          type: 'jpeg'
        }
      ]);
    });
  }
}
