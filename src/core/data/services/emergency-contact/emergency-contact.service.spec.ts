import  Dexie  from 'dexie';
import { SCHEMA } from '@services/dexie/database';
import { DexieService } from '../dexie/dexie.service';
import { EmergencyContactService } from './emergency-contact.service';
import { TestBed } from '@angular/core/testing';
import { ProfileService } from '../profile/profile.service';
import { DirectoryService } from '../directory/directory.service';
import { FileService } from '../file/file.service';
import { ItemService } from '../item/item.service';
import { Events } from 'ionic-angular';
import { FileSystemService } from '../file-system/file-system.service';
import { Zip } from '@ionic-native/zip';
import { BackupDBService } from '../backup/backup-db.service';
import { File } from '@ionic-native/file';


class DATABASE extends Dexie {
  constructor() {
    super('emergency_contact_test');

    this.version(1).stores(SCHEMA);

    this.on('populate', () => {
      this.table('profile').add({
        directory: 1,
        current_profile: true
      });
      this.table('directory').bulkAdd([
        {id: 1},
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
    EmergencyContactService,
    DirectoryService,
    ItemService,
    FileService,
    Events,
    FileSystemService,
    File,
    BackupDBService,
    Zip
  ]
};

describe('Emergency Contact Service', () => {
  let dexie: DexieService;
  let profileService: ProfileService;
  let directory: DirectoryService;
  let emergencyContactService: EmergencyContactService;
  let mockDatabase: DATABASE;

  beforeEach(async() => {
    mockDatabase = new DATABASE();
    const bed = TestBed.configureTestingModule(testBedSetup);
    TestBed.overrideProvider(DexieService, { useValue: mockDatabase });
    dexie = bed.get(DexieService);
    directory = bed.get(DirectoryService);
    profileService = bed.get(ProfileService);
    emergencyContactService = bed.get(EmergencyContactService);
  });

  afterAll(async() => {
    mockDatabase.delete();
    mockDatabase = new DATABASE();
    TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
  });

  it("GIVEN no emergency contacts THEN it should not retrieve anything", async() => {
    const profileId = await profileService.getCurrentProfileId();
    const emergencyContact = await emergencyContactService.getEmergencyContact(profileId);
    expect(emergencyContact).toBeUndefined();
  });

  it("GIVEN no emergency contacts THEN we can add one", async() => {
    const profile = await profileService.getCurrentProfile();
    await emergencyContactService.setEmergencyContact(profile.id, 'Bob', 'Friend', 911);
    const emergencyContact = await emergencyContactService.getEmergencyContact(profile.id);
    expect(emergencyContact.name).toBe('Bob');
  });

  it("GIVEN existing emergency contact THEN we can overwrite it", async() => {
    const profile = await profileService.getCurrentProfile();
    await emergencyContactService.setEmergencyContact(profile.id, 'Bob', 'Friend', 911);
    await emergencyContactService.setEmergencyContact(profile.id, 'Not Bob', 'Friend', 911);
    const emergencyContact = await emergencyContactService.getEmergencyContact(profile.id);
    expect(emergencyContact.name).toBe('Not Bob');
  })

});
