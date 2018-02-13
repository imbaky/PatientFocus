import { TestBed } from '@angular/core/testing';
import { File } from '@ionic-native/file';
import { DexieService } from '@services/dexie/dexie.service';
import { DirectoryService } from './directory.service';
import { ItemService } from '@services/item/item.service';
import { FileService } from '@services/file/file.service';
import Dexie from 'dexie';
import { SCHEMA } from '../dexie/database';
import { PageType } from '@enum/page-type.enum';
import { PortfolioType, FileFormatType } from '@enum/file-type.enum';
import { BackupDBService } from '../backup/backup-db.service';
import { Zip } from '@ionic-native/zip';
import { FileSystemService } from '@services/file-system/file-system.service';

class DATABASE extends Dexie {
  constructor() {
    super('directory_test');

    this.version(1).stores(SCHEMA);
    const date = new Date();
    const items = [
      {
        title: 'Health Problems',
        directory_id: 1,
        description: 'lab test1',
        file_id: 1,
        page: PageType.Portfolio,
        chosen_date: '2018-01-01',
        document_type: PortfolioType.DIAGNOSIS,
        user_defined_file_name: 'User defined name',
        created: date
      },
      {
        title: 'Health Problems',
        directory_id: 1,
        description: 'lab test1',
        file_id: 2,
        page: PageType.Portfolio,
        chosen_date: '2018-01-01',
        document_type: PortfolioType.DIAGNOSIS,
        user_defined_file_name: 'User defined name',
        created: date
      },
      {
        title: 'Health Problems',
        description: 'lab test1',
        directory_id: 1,
        file_id: 3,
        page: PageType.Portfolio,
        chosen_date: '2018-01-01',
        document_type: PortfolioType.DIAGNOSIS,
        user_defined_file_name: 'User defined name',
        created: date
      }
    ];
    this.on('populate', () => {
      this.table('profile').add({
        directory: 1
      });
      this.table('directory').bulkAdd([
        { id: 1 },
        { id: 2 },
      ]);
      this.table('item').bulkAdd( items );
      this.table('file').bulkAdd([
        {
          id: 1,
          path: '::directory/subdirectory/subsubdirectory/',
          file_name: 'filename1.jpg',
          size: 4576543,
          format: FileFormatType.JPG,
          type: 'jpg'
        },
        {
          id: 2,
          path: '::directory/subdirectory/subsubdirectory/',
          file_name: 'filename2.jpg',
          size: 4576543,
          format: FileFormatType.JPG,
          type: 'jpg'
        },
        {
          id: 3,
          path: '::directory/subdirectory/subsubdirectory/',
          file_name: 'filename3.pdf',
          size: 4576543,
          format: FileFormatType.PDF,
          type: 'jpg'
        }
      ]);
    });
  }
}
const testBedSetup = {
  providers: [
    {
      provide: DexieService,
      useValue: DATABASE
    },
    DirectoryService,
    ItemService,
    FileService,
    File,
    BackupDBService,
    Zip,
    FileSystemService
  ]
};

describe('Directory Service', () => {
  let dexie: DexieService;
  let directory: DirectoryService;
  let item: ItemService;
  let file: FileService;
  let mockDatabase: DATABASE;

  beforeEach(async() => {
    mockDatabase = new DATABASE();
    const bed = TestBed.configureTestingModule(testBedSetup);
    TestBed.overrideProvider(DexieService, { useValue: mockDatabase });
    dexie = bed.get(DexieService);
    directory = bed.get(DirectoryService);
    item = bed.get(ItemService);
    file = bed.get(FileService);
  });

  it('GIVEN three items THEN it should retrieve the items AND match document types', async () => {
    let folder  = await directory.getDirectoryById(1);
    expect(folder.items.length).toBe(3);
    expect(folder.items[0].document_type).toBe(PortfolioType.DIAGNOSIS);
    expect(folder.items[1].document_type).toBe(PortfolioType.DIAGNOSIS);
    expect(folder.items[2].document_type).toBe(PortfolioType.DIAGNOSIS);

    folder  = await directory.getDirectoryById(2);
    expect(folder.items.length).toBe(0);
  });

});
