import { Injectable } from '@angular/core';

import Dexie from 'dexie';
import { DocumentType, FileFormatType } from '../../enum/file-type.enum';
import { SCHEMA } from './database';

@Injectable()
export class DexieService extends Dexie {

  constructor() {
    super('store');
    this.version(1).stores(SCHEMA);

    this.on('populate', () => {
      this.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 4576543,
          document_type: DocumentType.BLOOD_TEST,
          format: FileFormatType.JPG
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 245364,
          document_type: DocumentType.CONSULTATION,
          format: FileFormatType.PNG
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 34564,
          document_type: DocumentType.PRESCRIPTION,
          format: FileFormatType.PDF
        }
      ]);
    });
  }
}
