import { TestBed } from '@angular/core/testing';
import { DexieService } from '../dexie/dexie.service';
import { DATABASE } from '../dexie/test-database';
import { BackupDBService } from '../backup/backup-db.service';
import { PortfolioType } from '@enum/file-type.enum';
import { Zip } from '@ionic-native/zip';
import { Item } from '@services/item/item.service';
import { PageType } from '@enum/page-type.enum';
import { UserProfile } from '@services/profile/profile.service';
import { Reminder } from '@services/reminders/reminders.interface';
import { File as NativeFile } from '@ionic-native/file';
import { File } from '@services/file/file.service';

const testBedSetup = {
  providers: [
    {
      provide: DexieService,
      useValue: DATABASE
    },
    BackupDBService,
    NativeFile,
    Zip
  ]
};

describe('Backup Database Service', async() => {
  let dexieService: DexieService;
  let mockDatabase: DATABASE;
  let backUpDbService: BackupDBService;
  let jsonObject;

  beforeEach(async () => {
    mockDatabase = new DATABASE();
    const bed = TestBed.configureTestingModule(testBedSetup);
    TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
    dexieService = bed.get(DexieService);
    backUpDbService = bed.get(BackupDBService);
    jsonObject = JSON.parse(await backUpDbService.exportProfile(1, "password"));
  });

  it('GIVEN a dexie database of a profile THEN the correct tables should be extracted', async() =>{
    expect(jsonObject.item).toBeDefined();
    expect(jsonObject.directory).toBeDefined();
    expect(jsonObject.profile).toBeDefined();
    expect(jsonObject.medical_info).toBeDefined();
    expect(jsonObject.item).toBeDefined();
    expect(jsonObject.file).toBeDefined();
    expect(jsonObject.reminder).toBeDefined();
    expect(jsonObject.appointment).toBeDefined();
    expect(jsonObject.emergency_contact).toBeDefined();
    expect(Object.keys(jsonObject).length).toBe(8); //There should only be 8 tables in the database (depends on SCHEMA) If you add a table increase number
  });

  it('GIVEN a dexie database of a profile THEN the correct information of the files should be extracted', async() =>{
    let files : File[] = JSON.parse(jsonObject.file);
    expect(files.length).toBe(3);
    expect(files[0].file_name).toBe("filename1");
  });


  it('GIVEN a dexie database of a profile THEN the correct information of the items should be extracted', async () => {
    let items : Item[] = JSON.parse(jsonObject.item);
    expect(items.length).toBe(3);
    expect(items[0].title).toBe("Health Problems1");
    expect(items[0].directory_id).toBe(1);
    expect(items[0].description).toBe('lab test1');
    expect(items[0].file_id).toBe(1);
    expect(items[0].page).toBe(PageType.Portfolio);
    expect(items[0].chosen_date).toBe( '2018-01-01');
    expect(items[0].document_type).toBe(PortfolioType.DIAGNOSIS);
  });

  it('GIVEN a dexie database of a profile THEN the correct information of the profile should be extracted', async () => {
    let profile : UserProfile[] = JSON.parse(jsonObject.profile);
    expect(profile.length).toBe(1);
    expect(profile[0].id).toBe(1);
    expect(profile[0].directory).toBe(1);
    expect(profile[0].dob).toBe('2018-04-01');
    expect(profile[0].gender).toBe('male');
    expect(profile[0].name).toBe( 'Deez Nuts');
    expect(profile[0].password).toBe("password");
  });

  it('GIVEN a dexie database of a profile THEN the correct information of the reminders should be extracted', async () => {
    let reminders : Reminder[] = JSON.parse(jsonObject.reminder);
    expect(reminders.length).toBe(4);
    expect(reminders[0].frequencies.length).toBe(2);
    expect(reminders[0].frequencies[0].frequency).toBe('2018-01-24T1:00:00-05:00');
    expect(reminders[0].frequencies[0].frequency_id).toBe(100);
    expect(reminders[0].fk_profile_id).toBeDefined(1);
  });

  it('GIVEN a dexie database of a profile THEN the correct information of the appointments should be extracted', async () => {
    let appointments : Reminder[] = JSON.parse(jsonObject.appointment);
    expect(appointments.length).toBe(3);
    expect(appointments[0].title).toBe('Check up1');
  });



});