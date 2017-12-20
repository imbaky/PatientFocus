import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';
import { Document_Type, FileFormat_Type } from '../../enum/file-type.enum';

import Dexie from 'dexie';

export interface File {
  id?: number;
  path: string;
  document_type: Document_Type;
  size: number;
  format: FileFormat_Type;
}

@Injectable()
export class FileService {

  table: Dexie.Table<File, number>;

  constructor(
    private dexie: DexieService
  ) {
    this.table = this.dexie.table('file');
  }

  async getFilesByIds(ids: number[]): Promise<File[]> {
    const files = ids.map((id) => this.table.get(id));

    return Promise.all(files);
  }

}
