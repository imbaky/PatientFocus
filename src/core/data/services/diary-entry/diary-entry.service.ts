import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DexieService } from '../dexie/dexie.service';

export interface DiaryEntry {
  id?: number;
  title: string;
  description: string;
  created: string;
}

@Injectable()
export class DiaryEntryService {

  table: Dexie.Table<DiaryEntry, number>;

  constructor(
    private dexie: DexieService,
  ) {
    this.table = this.dexie.table('entry');
  }

  async getEntriesByDiaryId(diary: number): Promise<DiaryEntry[]> {
    const entries = await this.table.where('diary_id').equals(diary).toArray();
    return entries;
  }
}
