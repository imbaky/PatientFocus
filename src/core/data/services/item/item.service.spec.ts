import {TestBed} from '@angular/core/testing';
import {File} from '@ionic-native/file';
import Dexie from 'dexie';
import * as moment from 'moment';

import {FileService} from '@services/file/file.service';
import {DexieService} from '@services/dexie/dexie.service';
import {SCHEMA} from '@services/dexie/database';
import {ItemService} from '@services/item/item.service';
import {PageType} from '@enum/page-type.enum';
import {FileFormatType, PortfolioType} from '@enum/file-type.enum';
import {File as NativeFile} from '@interfaces/file/file';
import {Item} from '@interfaces/item/item';
import {DirectoryService} from '@services/directory/directory.service';
import {BackupDBService} from '../backup/backup-db.service';
import { Zip } from '@ionic-native/zip';
import { FileSystemService } from '@services/file-system/file-system.service';

class DATABASE extends Dexie {
  constructor() {
    super('item_service_test');

    this.version(1).stores(SCHEMA);
    const date = new Date();
    const items = [
      {
        title: 'Health Problems1',
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
        title: 'Health Problems2',
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
        title: 'Health Problems3',
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
      this.table('directory').bulkAdd([{ id: 1 }, { id: 2 }]);
      this.table('item').bulkAdd(items);
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
    FileSystemService,
    File,
    BackupDBService,
    Zip,
  ]
};

describe('Item Service', () => {
  let dexie: DexieService;
  let item: ItemService;
  let file: FileService;
  let mockDatabase: DATABASE;

  beforeEach(async () => {
    mockDatabase = new DATABASE();
    const bed = TestBed.configureTestingModule(testBedSetup);
    TestBed.overrideProvider(DexieService, { useValue: mockDatabase });
    dexie = bed.get(DexieService);
    item = bed.get(ItemService);
    file = bed.get(FileService);
  });

  afterAll( async() => {
    mockDatabase.delete();
    mockDatabase = new DATABASE();
    TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
  });

  it('GIVEN three items in a directory THEN it should retrieve all the items', async () => {
    const items = await item.getItemsByDirectoryId(1);
    expect(items.length).toBe(3);
    expect(items[0].document_type).toBe(PortfolioType.DIAGNOSIS);
    expect(items[1].document_type).toBe(PortfolioType.DIAGNOSIS);
    expect(items[2].document_type).toBe(PortfolioType.DIAGNOSIS);
  });

  it('GIVEN an invalid directory ID THEN it should retrieve no items', async () => {
    const items = await item.getItemsByDirectoryId(88);
    expect(items.length).toBe(0);
  });

  it('GIVEN a diary entry with an attached file THEN it should create an item', async () => {
    const countBefore = await mockDatabase.table('item').count();
    const diaryFile: NativeFile = {
      id: 4,
      path: '::directory/subdirectory/subsubdirectory/',
      format: FileFormatType.JPG,
      file_name: 'dry_skin.jpg',
      size: 808
    };
    const creation_date = moment().format('YYYY-MM-DD');
    const document_name = 'Dry Skin on Arm';
    const specificValues = {
      page: PageType.Diary
    };
    const created_item = await item.createItemAsFile(
      diaryFile,
      creation_date,
      1,
      document_name,
      specificValues
    );

    expect(created_item.directory_id).toBe(1);
    expect(created_item.page).toBe(specificValues.page);
    expect(created_item.title).toBe(document_name);
    expect(created_item.file).toBe(diaryFile);
    expect(created_item.file_id).toBe(diaryFile.id);
    expect(created_item.chosen_date).toBe(creation_date);
    const countAfter = await mockDatabase.table('item').count();
    expect(countAfter).toBe(countBefore + 1);
  });

  it('GIVEN a medical document THEN it should create an item', async () => {
    const countBefore = await mockDatabase.table('item').count();
    const medicalDoc: NativeFile = {
      id: 5,
      path: '::directory/subdirectory/subsubdirectory2/',
      format: FileFormatType.PDF,
      file_name: 'lab_test.jpg',
      size: 8869
    };
    const creation_date = moment().format('YYYY-MM-DD');
    const document_name = 'Blood Test';
    const specificValues = {
      page: PageType.Portfolio
    };
    const created_item = await item.createItemAsFile(
      medicalDoc,
      creation_date,
      1,
      document_name,
      specificValues
    );

    expect(created_item.directory_id).toBe(1);
    expect(created_item.page).toBe(specificValues.page);
    expect(created_item.title).toBe(document_name);
    expect(created_item.file).toBe(medicalDoc);
    expect(created_item.file_id).toBe(medicalDoc.id);
    expect(created_item.chosen_date).toBe(creation_date);
    const countAfter = await mockDatabase.table('item').count();
    expect(countAfter).toBe(countBefore + 1);
  });

  it('GIVEN a diary entry without an attached file THEN it should create an item', async () => {
    const countBefore = await mockDatabase.table('item').count();
    const new_item: Item = {
      title: 'Blood Pressure Measurement',
      description: 'Morning measurement',
      chosen_date: moment().format('YYYY-MM-DD'),
      page: PageType.Diary,
      directory_id: 1
    };
    const created_item = await item.addItemToDB(new_item);

    expect(created_item.directory_id).toBe(1);
    expect(created_item.page).toBe(new_item.page);
    expect(created_item.title).toBe(new_item.title);
    expect(created_item.file).toBe(undefined);
    expect(created_item.file_id).toBe(undefined);
    expect(created_item.chosen_date).toBe(new_item.chosen_date);
    const countAfter = await mockDatabase.table('item').count();
    expect(countAfter).toBe(countBefore + 1);
  });
});
