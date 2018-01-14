import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DexieService } from '../dexie/dexie.service';

export interface Diary {
  id?: number;
}

@Injectable()
export class DiaryService {

  table: Dexie.Table<Diary, number>;

  constructor(
    private dexie: DexieService
  ) {
    this.table = this.dexie.table('diary');
  }

  /**
   * Create a new diary with a given id
   * @param id - profile id
   * @returns {Promise<number>}
   */
  async createNewDiary(id: number) {
    return await this.dexie.table('diary').add({id: id});
  }

  /**
   * Return a diary by id
   * @param id
   * @returns {Promise<Diary>}
   */
  async getDiaryById(id: number): Promise<Diary> {
    const diary = await this.table.get(id);
    return diary;
  }
}
