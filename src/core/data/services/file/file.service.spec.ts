import { TestBed } from '@angular/core/testing';
import { File } from '@ionic-native/file';
import Dexie from 'dexie';
import { DexieService } from '../dexie/dexie.service';
import { DirectoryService } from '../directory/directory.service';
import { ItemService } from '../item/item.service';
import { FileService, File as FileType } from '../file/file.service';

import { PortfolioType, FileFormatType } from '../../enum/file-type.enum';
import { ItemType } from '../../enum/item-type.enum';
import { SCHEMA } from '../dexie/database';
import { BackupDBService } from '../backup/backup-db.service';
import { Zip } from '@ionic-native/zip';

class DATABASE extends Dexie {
  constructor() {
    super('store');

    this.version(1).stores(SCHEMA);

    const date = new Date();
    this.on('populate', () => {
      this.table('profile').add({
        directory: 1
      });
      this.table('directory').bulkAdd([{ id: 1 }]);
      this.table('item').bulkAdd([
        {
          name: 'Filename1.txt',
          description: 'lab test1',
          type: ItemType.Item,
          type_id: 1,
          directory_id: 1,
          created: date
        },
        {
          name: 'Filename2.txt',
          description: 'lab test2',
          type: ItemType.Item,
          type_id: 2,
          directory_id: 1,
          created: date
        },
        {
          name: 'Sub Folder1',
          description: '',
          type: ItemType.Directory,
          type_id: 2,
          directory_id: 1
        },
        {
          name: 'Filename2.txt',
          description: 'blood test',
          type: ItemType.Item,
          type_id: 3,
          directory_id: 2,
          created: date
        }
      ]);
      this.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory1',
          size: 885421,
          document_type: PortfolioType.BLOOD_TEST,
          format: FileFormatType.JPG
        },
        {
          path: '::directory/subdirectory/subsubdirectory2',
          size: 4122017,
          type: 'jpeg',
          document_type: PortfolioType.CONSULTATION,
          format: FileFormatType.PNG
        },
        {
          path: '::directory/subdirectory/subsubdirectory3',
          size: 9514173,
          type: 'jpeg',
          document_type: PortfolioType.PRESCRIPTION,
          format: FileFormatType.PDF
        }
      ]);
    });
  }
}

describe('File Service', () => {
  let dexie: DexieService;
  let directory: DirectoryService;
  let item: ItemService;
  let file: FileService;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        {
          provide: DexieService,
          useClass: DATABASE
        },
        DirectoryService,
        ItemService,
        FileService,
        File,
        BackupDBService,
        Zip
      ]
    });

    dexie = bed.get(DexieService);
    directory = bed.get(DirectoryService);
    item = bed.get(ItemService);
    file = bed.get(FileService);
  });

  it('GIVEN three files THEN it should retrieve no files', async () => {
    const ids = [];
    const result = await file.getFilesByIds(ids);
    expect(result.length).toBe(0);
  });

  it('GIVEN three files THEN it should retrieve specifics files by ID', async () => {
    const ids = [1, 2, 3];
    const files = await file.getFilesByIds(ids);
    expect(files.length).toBe(3);
  });

  it('GIVEN a file with a supported file type THEN it should create a new file', async () => {
    const path = 'directory/subdirectory/subsubdirectory/anthonyrobert_consultation.pdf';
    const document_type = PortfolioType.CONSULTATION;
    const document_name = 'Medical document';
    const newFile = await file.createFile(path);
    expect(newFile.path).toBe(path);
    expect(newFile.format).toBe(FileFormatType.PDF);
    const ids = [newFile.id];
    const files = await file.getFilesByIds([newFile.id]);
    expect(newFile.id).toBe(files[0].id);
  });

  it('GIVEN a file with a unsupported file type THEN it should still create a new file', async () => {
    const path = 'directory/subdirectory/subsubdirectory/anthonyrobert_consultation.docx';
    const document_type = PortfolioType.CONSULTATION;
    const document_name = 'Medical document';
    const newFile = await file.createFile(path);
    expect(newFile.path).toBe(path);
    expect(newFile.format).toBe(FileFormatType.Other);
    const ids = [newFile.id];
    const files = await file.getFilesByIds([newFile.id]);
    expect(newFile.id).toBe(files[0].id);
  });
});
