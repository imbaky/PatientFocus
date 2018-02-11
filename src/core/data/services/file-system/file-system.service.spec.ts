import { TestBed } from '@angular/core/testing';
import { File } from '@ionic-native/file';
import { DexieService } from '../dexie/dexie.service';
import { ItemType } from '../../enum/item-type.enum';
import { DirectoryService } from '../directory/directory.service';
import { ItemService } from '../item/item.service';
import { FileService } from '../file/file.service';
import { PortfolioType, FileFormatType } from '../../enum/file-type.enum';
import { FileSystemService } from './file-system.service';

import Dexie from 'dexie';
import { SCHEMA } from '../dexie/database';
import {PageType} from '../../enum/page-type.enum';

class DATABASE extends Dexie {
  constructor() {
    super('file_system_test');

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
          file_name: 'Filename1.txt',
          description: 'lab test1',
          page: PageType.Portfolio,
          type_id: 1,
          directory_id: 1,
          created: date,
          document_type: PortfolioType.BLOOD_TEST,
        },
        {
          file_name: 'Filename2.txt',
          description: 'lab test2',
          page: PageType.Portfolio,
          type_id: 2,
          directory_id: 1,
          created: date,
          document_type: PortfolioType.BLOOD_TEST,
        },
        {
          file_name: 'Filename3.txt',
          description: 'blood test',
          page: PageType.Portfolio,
          type_id: 3,
          directory_id: 1,
          created: date,
          document_type: PortfolioType.BLOOD_TEST,
        },
      ]);
      this.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 4576543,
          format: FileFormatType.JPG,
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 245364,
          format: FileFormatType.JPG
        },
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 34564,
          format: FileFormatType.JPG
        }
      ]);
    });
  }
}


const testBedSetup = {
  providers: [
    FileSystemService,
    {
      provide: DexieService,
      useClass: DATABASE
    },
    DirectoryService,
    ItemService,
    FileService,
    File
  ]
};

describe('File System Service', () => {
  let dexie: DexieService;
  let directory: DirectoryService;
  let item: ItemService;
  let file: File;
  let fileService: FileService;
  let mockDatabase: DATABASE;
  let fileSystemService: FileSystemService;

  beforeEach( async() => {
    mockDatabase = new DATABASE();
    const bed = TestBed.configureTestingModule(testBedSetup);
    dexie = bed.get(DexieService);
    directory = bed.get(DirectoryService);
    file = bed.get(File);
    fileService = bed.get(FileService);
    fileSystemService = bed.get(FileSystemService);
  });

  it( 'GIVEN zero already existing files THEN the imported file should have the same file name', async() => {
    const folder = await directory.getDirectoryById(1);
    const originalFileName = 'Filename1.txt';
    const spy = spyOn(file, 'checkFile').and.returnValues(Promise.resolve(false));
    const newFileName = await fileSystemService.createFileName(originalFileName, folder);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(newFileName).toBe(originalFileName);
  });

  it( 'GIVEN 1 already existing files THEN the imported file should have a _1 appened to the file name', async() => {
    const folder = await directory.getDirectoryById(1);
    const originalFileName = 'Filename1.txt';
    const spy = spyOn(file, 'checkFile').and.returnValues(Promise.resolve(true), Promise.resolve(false));
    const newFileName = await fileSystemService.createFileName(originalFileName, folder);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(newFileName).toBe('Filename1_1.txt');
  });

  it( 'GIVEN that the new file name already exists THEN the imported file should have a _2 appended to the file name', async() => {
    const folder = await directory.getDirectoryById(1);
    const originalFileName = 'Filename1.txt';
    const spy = spyOn(file, 'checkFile').and.returnValues(Promise.resolve(true), Promise.resolve(false));
    let newFileName = await fileSystemService.createFileName(originalFileName, folder);
    expect(newFileName).toBe('Filename1_1.txt');
    expect(spy).toHaveBeenCalledTimes(2);
    spy.calls.reset();
    const newImportedFile = 'Filename1.txt';
    spy.and.returnValues(Promise.resolve(true), Promise.resolve(true), Promise.resolve(false));
    newFileName = await fileSystemService.createFileName(originalFileName, folder);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(newFileName).toBe('Filename1_2.txt');
  });

  xit('GIVEN new file information THEN an item should be created', async() => {
    const fileInfo = {
      fullPath: 'directory/subdirectory/subsubdirectory',
      creationDate: this.date,
      newDocumentName: 'New Blood Test',
      specificValues: {
        document_type: PortfolioType.BLOOD_TEST,
        page: PageType.Portfolio
      }
    }
    const folder = await directory.getDirectoryById(1);
    const item = await fileSystemService.addNewFileToDirectory(fileInfo.fullPath, 
      fileInfo.creationDate, fileInfo.newDocumentName, folder, fileInfo.specificValues);
    expect(item.title).toBe('Filename1.txt');
    expect(item.page).toBe(PageType.Portfolio);
    expect(item.chosen_date).toBe(this.date);
  });


});
