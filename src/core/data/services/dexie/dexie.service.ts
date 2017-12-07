import { Injectable } from '@angular/core';

import Dexie from 'dexie';

@Injectable()
export class DexieService extends Dexie {

  constructor() {
    super('store');

    this.version(1).stores({

    });
  }
}
