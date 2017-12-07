import { TestBed } from '@angular/core/testing';
import { DexieService } from '../dexie/dexie.service';
import { ItemType } from '../../enum/item-type.enum';
import { DirectoryService } from './directory.service';
import { ItemService } from '../item/item.service';
import { FileService } from '../file/file.service';

describe('Directory Service', () => {
  let dexie: DexieService;
  let directory: DirectoryService;
  let item: ItemService;
  let file: FileService;

  beforeEach(() => {
    let bed = TestBed.configureTestingModule({
      providers: [
        DexieService,
        DirectoryService,
        ItemService,
        FileService
      ]
    });

    dexie = bed.get(DexieService);
    directory = bed.get(DirectoryService);
    item = bed.get(ItemService);
    file = bed.get(FileService);

    dexie.on('populate', () => {
      dexie.table('profile').add({
        directory: 1
      });
      dexie.table('directory').bulkAdd([
        { id: 1 },
        { id: 2 },
      ]);
      dexie.table('item').bulkAdd([
        {
          name: 'Filename1.txt',
          type: ItemType.FILE,
          type_id: 1,
          directory_id: 1
        },
        {
          name: 'Untitled Folder',
          type: ItemType.DIRECTORY,
          type_id: 1,
          directory_id: 1
        }
      ]);
      dexie.table('file').bulkAdd([
        {
          path: '::directory/subdirectory/subsubdirectory',
          size: 4576543
        }
      ]);
    });
  });

  it('GIVEN two items one file and folder in a directory THEN it should retrieve the items in the populated database', async () => {
    let folder  = await directory.getDirectoryById(1);

    expect(folder.items.length).toBe(2);
    expect(folder.items[0].type).toBe(ItemType.FILE);
    expect(folder.items[1].type).toBe(ItemType.DIRECTORY);
  });

});