import { Injectable } from '@angular/core';

import Dexie from 'dexie';
import { ItemType } from '../../enum/item-type.enum';
import { Document_Type, FileFormat_Type } from '../../enum/file-type.enum';
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
          effective: date.toISOString()
        },
        {
          name: 'Filename2.txt',
          description: 'lab test2',
          type: ItemType.FILE,
          type_id: 2,
          directory_id: 1,
          effective: date.toISOString()
        },
        {
          name: 'Filename2.txt',
          description: 'blood test',
          type: ItemType.FILE,
          type_id: 3,
          directory_id: 1,
          effective: date.toISOString()
        },
      ]);
      this.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 4576543,
          document_type: Document_Type.BLOOD_TEST,
          format: FileFormat_Type.JPG
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 245364,
          document_type: Document_Type.CONSULTATION,
          format: FileFormat_Type.PNG
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 34564,
          document_type: Document_Type.PRESCRIPTION,
          format: FileFormat_Type.PDF
        }
      ]);
    });
  }
}
