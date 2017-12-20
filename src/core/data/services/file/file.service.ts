import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';
import { DocumentType, FileFormatType } from '../../enum/file-type.enum';

import Dexie from 'dexie';

export interface File {
  id?: number;
  path: string;
  document_type: DocumentType;
  size: number;
  format: FileFormatType;
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

  async createFile(path: string, size: number, type: DocumentType): Promise<File> { //TODO return Promise<File>
    const file: File = {
      path : path,
      size : size,
      document_type : type
    };
    var pk = await this.table.add(file)
    file.id = pk;
    return file;
  }

}
