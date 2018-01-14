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
      
    });
  }
}
