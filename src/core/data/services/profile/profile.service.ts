import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';

export interface Profile {
  id?: number;
  directory: number;
}

@Injectable()
export class ProfileService {

  table: Dexie.Table<Profile, number>;

  constructor(
    private dexie: DexieService
  ) {
    this.table = this.dexie.table('profile');
  }

}
