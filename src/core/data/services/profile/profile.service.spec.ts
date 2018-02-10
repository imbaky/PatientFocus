import { Events } from 'ionic-angular/util/events';
import { TestBed } from '@angular/core/testing';
import { File as NativeFile } from '@ionic-native/file';
import { DexieService } from '@services/dexie/dexie.service';
import Dexie from 'dexie';
import { SCHEMA } from '@services/dexie/database';
import { ProfileService } from '@services/profile/profile.service';
import { DirectoryService } from '@services/directory/directory.service';
import { ItemService } from '@services/item/item.service';
import { FileService } from '@services/file/file.service';
import { PageType } from '@enum/page-type.enum';
import { PortfolioType, FileFormatType } from '../../enum/file-type.enum';

class DATABASE extends Dexie {
  constructor() {
    super('profile_test');

    this.version(1).stores(SCHEMA);
    const date = new Date();
    const items = [
      {
        title: 'Health Problems',
        directory_id: 1,
        description: 'lab test1',
        file_id: 1,
        profile_id: 1,
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
        profile_id: 1,
        page: PageType.Diary,
        chosen_date: '2018-01-01',
        user_defined_file_name: 'User defined name',
        created: date
      },
      {
        title: 'Health Problems',
        description: 'lab test1',
        directory_id: 1,
        file_id: 3,
        profile_id: 1,
        page: PageType.Diary,
        chosen_date: '2018-01-01',
        user_defined_file_name: 'User defined name',
        created: date
      }
    ];
    this.on('populate', () => {
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
      useClass: DATABASE
    },
    ProfileService,
    DirectoryService,
    ItemService,
    FileService,
    NativeFile,
    Events
  ]
};

describe('Profile Service', () => {
  let dexie: DexieService;
  let profileService: ProfileService;
  let mockDatabase: DATABASE;

  beforeEach(async () => {
    mockDatabase = new DATABASE();
    const bed = TestBed.configureTestingModule(testBedSetup);
    TestBed.overrideProvider(DexieService, { useValue: mockDatabase });
    dexie = bed.get(DexieService);
    profileService = bed.get(ProfileService);
    profileService.clearDb();
  });

  it('GIVEN no Profiles THEN it should not retrieve anything', async () => {
    const profile = await profileService.getFirstProfile();
    expect(profile).toBeUndefined();
  });

  it('GIVEN an existing Profile THEN it should retrieve it', async () => {
    await profileService.save({
      name: 'John',
      password: 'Password'
    });
    const profile = await profileService.getFirstProfile();
    const diaryEntries = await profileService.getProfileDiaryItems(profile.id);
    expect(profile.name).toBe('John');
    expect(diaryEntries.length).toBe(2);
  });

  it('GIVEN an existing Profile THEN it should contain a directory with the same id', async () => {
    await profileService.save({
      name: 'John',
      password: 'Password'
    });
    const profile = await profileService.getFirstProfile();
    expect(profile.directory).toEqual(profile.id);
  });

  it('GIVEN an existing Profile THEN the fields can be modified', async () => {
    await profileService.save({
      name: 'John',
      password: 'Password'
    });
    let profile = await profileService.getFirstProfile();
    await profileService.editProfile('Tim', 'Male', 'January 1 1995');
    profile = await profileService.getFirstProfile();
    expect(profile.gender).toEqual('Male');
    expect(profile.name).toEqual('Tim');
    expect(profile.dob).toEqual('January 1 1995');
  });
});
