import {Injectable} from '@angular/core';
import {Entry} from '@ionic-native/file';
import Dexie from 'dexie';

import {DexieService} from '../dexie/dexie.service';
import {ItemService} from '@services/item/item.service';
import {PortfolioType} from '@enum/file-type.enum';
import {FileService} from '@services/file/file.service';
import {Directory} from '@interfaces/directory/directory';
import {Item} from '@interfaces/item/item';


@Injectable()
export class DirectoryService {

  table: Dexie.Table<Directory, number>;

  constructor(
    private dexie: DexieService,
    private items: ItemService,
    private fileService: FileService,
  ) {
    this.table = this.dexie.table('directory');
  }

  /**
   * Creates a new directory with a given id
   * @param id - profile id
   * @returns {Promise<number>}
   */
  async createNewDirectory(id: number) {
    return await this.dexie.table('directory').add({id: id});
  }

  /**
   * Returns content items of a directory
   * @param id
   * @returns {Promise<Directory>}
   */
  async getDirectoryById(id: number): Promise<Directory> {
    const directory = await this.table.get(id);
    directory.items = await this.items.getItemsByDirectoryId(directory.id);
    return directory;
  }

  /**
   * Returns the directory objects.
   * @param ids
   * @returns {Promise<Directory[]>}
   */
  async getDirectoriesByIds(ids: number[]): Promise<Directory[]> {
    const directories = ids.map(id => this.table.get(id));

    return Promise.all(directories);
  }

  /**
   * Adds a file to a directory
   * @param {Entry} fileEntry file to be added to the directory
   * @param {string} creationDate Date in which the document should be placed
   * @param {PortfolioType} type type of medical document
   * @param {Directory} directory the directory in which the file will be added to
   */
  async addFileToDirectory(fileEntry: Entry, creationDate: string, directory: Directory,
                           newDocumentName: string, specificValues: any): Promise<Item> {
    const newFile = await this.fileService.createFile(fileEntry.nativeURL);
    await fileEntry.getMetadata(async (metadata) => {
      newFile.size = metadata.size;
    });
    const item = await this.items.createItemAsFile(newFile, creationDate, directory.id, newDocumentName, specificValues);
    directory.items.push(item);
    const newItems = [];
    directory.items.forEach( (newItem) => newItems.push(newItem));
    directory.items = newItems;
    return item;
  }

  async deleteItem(item: Item, directory: Directory) {
    try {
      if (item.file) {
        const itemFileDeleteResult = await this.fileService.deleteFile(item.file);
      }
      const itemDeleteResult = await this.items.deleteItem(item);
      const index = directory.items.indexOf(item);
      directory.items.splice(index, 1);
      const newItems = [];
      directory.items.forEach( (newItem) => newItems.push(newItem));
      directory.items = newItems;
    } catch (err) {
      console.error('Failed to delete item or file');
    }
  }

}
