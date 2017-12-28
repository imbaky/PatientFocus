import { TestBed } from '@angular/core/testing';
import { File } from '@ionic-native/file';
import { DexieService } from '../dexie/dexie.service';
import { ItemType } from '../../enum/item-type.enum';
import { DirectoryService } from './directory.service';
import { ItemService } from '../item/item.service';
import { FileService } from '../file/file.service';

import Dexie from 'dexie';
import { SCHEMA } from '../dexie/database';

class DATABASE extends Dexie {
  constructor() {
    super('store');

    this.version(1).stores(SCHEMA);

    const date = new Date();
    this.on('populate', () => {
      this.table('profile').add({
        directory: 1
      });
      this.table('directory').bulkAdd([
        { id: 1 },
        { id: 2 },
      ]);
      this.table('item').bulkAdd([
        {
          name: 'Filename1.txt',
          description: 'lab test1',
          type: ItemType.FILE,
          type_id: 1,
          directory_id: 1,
          created: date
        },
        {
          name: 'Filename2.txt',
          description: 'lab test2',
          type: ItemType.FILE,
          type_id: 2,
          directory_id: 1,
          created: date
        },
        {
          name: 'Sub Folder1',
          description: '',
          type: ItemType.DIRECTORY,
          type_id: 2,
          directory_id: 1
        },
        {
          name: 'Filename2.txt',
          description: 'blood test',
          type: ItemType.FILE,
          type_id: 3,
          directory_id: 2,
          created: date
        },
      ]);
      this.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 4576543,
          type: 'jpeg'
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 245364,
          type: 'jpeg'
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 34564,
          type: 'jpeg'
        }
      ]);
    });
  }
}

describe('Directory Service', () => {
  let dexie: DexieService;
  let directory: DirectoryService;
  let item: ItemService;
  let file: FileService;

  beforeEach(() => {
    let bed = TestBed.configureTestingModule({
      providers: [
        {
          provide: DexieService,
          useClass: DATABASE
        },
        DirectoryService,
        ItemService,
        FileService,
        File
      ]
    });

    dexie = bed.get(DexieService);
    directory = bed.get(DirectoryService);
    item = bed.get(ItemService);
    file = bed.get(FileService);
  });

  it('GIVEN three items THEN it should retrieve the items AND match types', async () => {
    let folder  = await directory.getDirectoryById(1);

    expect(folder.items.length).toBe(3);
    expect(folder.items[0].type).toBe(ItemType.FILE);
    expect(folder.items[1].type).toBe(ItemType.FILE);
    expect(folder.items[2].type).toBe(ItemType.DIRECTORY);

    folder  = await directory.getDirectoryById(2);

    expect(folder.items.length).toBe(1);
    expect(folder.items[0].type).toBe(ItemType.FILE);
  });


});