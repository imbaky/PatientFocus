import { Injectable } from '@angular/core';
import { DexieService } from '@services/dexie/dexie.service';
import { FileFormatType } from '@enum/file-type.enum';
import {File} from '@interfaces/file/file';

import Dexie from 'dexie';

@Injectable()
export class FileService {

  table: Dexie.Table<File, number>;

  constructor(
    private dexie: DexieService) {
    this.table = this.dexie.table('file');
  }

  async getFilesByIds(ids: number[]): Promise<File[]> {
    const files = ids.map((id) => this.table.get(id));
    return Promise.all(files);
  }

  /**
   *
   * @param {string} path the path of the file. The path does not include the filename
   * @returns {Promise<File>} Returns a promise with the newly created File
   */
  async createFile(path: string): Promise<File> {
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const extension = filename.substring(filename.lastIndexOf('.') + 1).toUpperCase();
    let fileFormat: FileFormatType = FileFormatType[extension];
    if (fileFormat === undefined) {
      fileFormat = FileFormatType.Other;
    }
    const file: File = {
      path : path,
      format : fileFormat,
      file_name: filename
    };
    const pk = await this.table.add(file);
    file.id = pk;
    return file;
  }

  async updateFile(file: File) { // replaces old file with new contents
    await this.table.put(file, file.id);
  }

  async deleteFile(file: File) {
    await this.table.delete(file.id);
  }

}
