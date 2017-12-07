import { Injectable } from '@angular/core';

import Dexie from 'dexie';

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
  }
}
