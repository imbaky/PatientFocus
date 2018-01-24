import { async, TestBed } from '@angular/core/testing';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';

import { RemindersService } from './reminders.service';
import { DexieService } from '../dexie/dexie.service';
import { ProfileService } from '../profile/profile.service';
import { DirectoryService } from '../directory/directory.service';
import { ItemService } from '../item/item.service';
import { FileService } from '../file/file.service';

import Dexie from 'dexie';
import { SCHEMA } from '../dexie/database';
import { NotificationsService } from '../notifications/notifications.service';
import * as moment from 'moment';
import {Reminder} from "./reminders.interface";

class DATABASE extends Dexie {
    constructor() {
        super('reminders_test');

        this.version(1).stores(SCHEMA);

        this.on('populate', () => {
            this.table('profile').add({
              id: 1,
              directory: 1,
              name: "name",
              password: "password"
            });
            this.table('reminders').bulkAdd([
                {
                    id: 1,
                    reminder_id: 10,
                    fk_profile_id: 1,
                    title: 'Reminder1',
                    text: 'Reminder1 text',
                    frequencies: [
                        {
                            frequency: "2018-01-24T1:00:00-05:00",
                            frequency_id: 100
                        },
                        {
                            frequency: "2018-01-24T2:00:00-05:00",
                            frequency_id: 101
                        }
                    ],
                    expires: '2018-01-28T00:00:00-05:00'
                },
                {
                    id: 2,
                    reminder_id: 11,
                    fk_profile_id: 1,
                    title: 'Reminder2',
                    text: 'Reminder2 text',
                    frequencies: [
                        {
                            frequency: "2018-01-24T14:00:00-05:00",
                            frequency_id: 102
                        },
                    ],
                    expires: '2018-01-26T00:00:00-05:00'
                },
                {
                    id: 3,
                    reminder_id: 12,
                    fk_profile_id: 1,
                    title: 'Reminder3',
                    text: 'Reminder3 text',
                    frequencies: [
                        {
                            frequency: "2018-01-24T14:00:00-05:00",
                            frequency_id: 103
                        },
                        {
                            frequency: "2018-01-24T15:00:00-05:00",
                            frequency_id: 104
                        }
                    ],
                    expires: '2018-01-25T00:00:00-05:00'
                }
            ]);
        });
    }
}

const testBedSetup = {
    providers: [
        RemindersService,
        LocalNotifications,
        NotificationsService,
        ProfileService,
        {
            provide: DexieService,
            useClass: DATABASE
        },
        DirectoryService,
        ItemService,
        FileService
    ]
};

describe('RemindersService TestBed', () => {
    let service: RemindersService;
    let dexieService: DexieService;
    let profileService: ProfileService;
    let directoryService: DirectoryService;
    let notificationsService: NotificationsService;
    let mockDatabase = new DATABASE();
    let today = moment('2018-01-24').toDate();
    jasmine.clock().mockDate(today); //set Todays Date

    beforeEach( async() => {
        mockDatabase = new DATABASE();
        let bed = TestBed.configureTestingModule(testBedSetup);
        TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
        dexieService = bed.get(DexieService);
        profileService = bed.get(ProfileService);
        service = bed.get(RemindersService);
    });


  it('#getReminders should return all reminders', async() => {
    const reminders = await service.getReminders();
    expect(reminders.length).toEqual(3);
    expect(reminders[0].reminder_id).toEqual(10);
    expect(reminders[1].reminder_id).toEqual(11);
    expect(reminders[2].reminder_id).toEqual(12);
  });



  it( "1 reminder with frequency 1 on 2018-01-24T14:24:33-05:00 should be added to the database", async () => {
    let reminder : Reminder=
      {
        reminder_id: 13,
        fk_profile_id: 1,
        title: "Added reminder",
        text: "Text for added reminder",
        frequencies: [
          {
          frequency: "2018-01-24T14:24:33-05:00",
          frequency_id: 1234
        }],
        expires: "2018-01-25T14:24:33-05:00"
      }
      reminder = await service.createReminder(reminder);
      const reminders = await service.getReminders();
      expect(reminders.length).toBe(4);
      expect(reminders[0].reminder_id).toEqual(10);
      expect(reminders[1].reminder_id).toEqual(11);
      expect(reminders[2].reminder_id).toEqual(12);
      expect(reminders[3].reminder_id).toEqual(13);
      expect(reminders[3].frequencies[0].frequency).toBe("2018-01-24T14:24:33-05:00");
  });


  it( "GIVEN a reminder with frequency 2, 2 notifications should be created", async () => {
    let reminder1 : Reminder=
      {
        reminder_id: 14,
        fk_profile_id: 1,
        title: "Added reminder",
        text: "Text for added reminder",
        frequencies: [{
          frequency: "2018-01-01T14:24:33-05:00",
          frequency_id: 166
        },
          {
            frequency: "2018-01-24T14:00:00-05:00",
            frequency_id: 8768
          }],
        expires: "2018-01-05T14:24:33-05:00"
      }
    var spy = spyOn(reminder1, "expires");
    await service.mapToNotification(reminder1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  //it("1 reminder with frequency 2 on 2018-01-24T14:24:33-05:00 and ")

});

