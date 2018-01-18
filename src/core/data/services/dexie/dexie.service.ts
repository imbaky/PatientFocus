import { Injectable } from '@angular/core';

import Dexie from 'dexie';
import { DocumentType, FileFormatType } from '../../enum/file-type.enum';
import { SCHEMA } from './database';

@Injectable()
export class DexieService extends Dexie {

  constructor() {
    super('store');
    this.version(1).stores(SCHEMA);
    const date = new Date();
    /*this.on('populate', () => {
      // TODO - Remove test data when no longer needed
      this.table('entry').bulkAdd([
        {
          diary_id: 1,
          title: 'Blood Pressure Measurement',
          description: 'BPM Results - Systol: 123 mmhg Diastol: 68 mmhg',
          created: date.toISOString()
        },
        {
          diary_id: 1,
          title: 'Skin Rash',
          description: 'I have dry skin with red patches. My skin itches and it seems to be getting worse.',
          created: date.toISOString()
        },
        {
          diary_id: 1,
          title: 'Glucose Reading',
          description: '7.0 mmol/L',
          created: date.toISOString()
        }
      ]);
    });*/
  }
}
