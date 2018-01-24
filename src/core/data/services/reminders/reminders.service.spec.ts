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
                },
                {
                    id: 10,
                    reminder_id: 112,
                    fk_profile_id: 10,
                    title: 'Reminder10',
                    text: 'Another profile',
                    frequencies: [
                        {
                            frequency: "2018-01-24T16:00:00-05:00",
                            frequency_id: 1000
                        },
                        {
                            frequency: "2018-01-24T17:00:00-05:00",
                            frequency_id: 2000
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
        notificationsService = bed.get(NotificationsService);
    });

    afterAll( async() => {
        mockDatabase.delete();
        mockDatabase = new DATABASE();
        TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
    });

    it('GIVEN profile 1 THEN 3 of 4 reminders should be returned.', async() => {
        const reminders = await service.getReminders(1);
        expect(reminders.length).toEqual(3);
        expect(reminders[0].reminder_id).toEqual(10);
        expect(reminders[1].reminder_id).toEqual(11);
        expect(reminders[2].reminder_id).toEqual(12);
    });

    it('GIVEN profile 10 THEN 1 of 4 reminders should be returned.', async() => {
        const reminders = await service.getReminders(10);
        expect(reminders.length).toEqual(1);
        expect(reminders[0].reminder_id).toEqual(112);
    });

    it('Create and then delete a reminder.', async () => {
        let reminder : Reminder=
        {
            reminder_id: 23,
            fk_profile_id: 1,
            title: "Added reminder",
            text: "Test create and delete",
            frequencies: [
                {
                frequency: "2018-01-24T14:25:00-05:00",
                frequency_id: 12345
            }],
            expires: "2018-01-25T14:25:33-05:00"
        }
        let newReminder = await service.createReminder(reminder);
        let reminders = await service.getReminders(1);
        expect(reminders.length).toEqual(4);

        await service.deleteReminder(newReminder);
        reminders = await service.getReminders(1);
        expect(reminders.length).toEqual(3);
    });

    it('1 reminder with frequency 1 on 2018-01-24T14:24:33-05:00 should be added to the database', async () => {
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
        const reminders = await service.getReminders(1);
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
          frequency: "2018-01-24T14:24:33-05:00",
          frequency_id: 166
        },
          {
            frequency: "2018-01-24T12:12:33-05:00",
            frequency_id: 8768
          }],
        expires: "2018-01-24T14:24:33-05:00"
      };
    let notifications = await service.mapToNotification(reminder1);
    expect(notifications.length).toEqual(2);
  });

  xit( 'GIVEN a reminder with frequency 2, 2 notifications should be created', async () => { //
     let frequencyDate1 = moment("2018-01-24T14:24:33-05:00").toISOString();
     let frequencyDate2 = moment("2018-01-24T12:12:33-05:00").toISOString();
     let expire = moment("2018-01-24T14:24:33-05:00").toISOString();

    let reminder1 : Reminder=
      {
        reminder_id: 14,
        fk_profile_id: 1,
        title: "Added reminder",
        text: "Text for added reminder",
        frequencies: [{
          frequency: frequencyDate1,
          frequency_id: 166
        },
          {
            frequency: frequencyDate2,
            frequency_id: 8768
          }],
        expires: expire
      };
    let notification1: any = {
      id: 166,
      text: "Text for added reminder",
      title: "Added reminder",
      trigger: { every: {hour: 14, minute: 24}, count: 1 }
    }
    let notification2: any = {
      id: 8768,
      text: "Text for added reminder",
      title: "Added reminder",
      trigger: { every: {hour: 12, minute: 12}, count: 1 }
    }
    let notifications : Array<ILocalNotification> = [];
    notifications.push(notification1);
    notifications.push(notification2);
    var spy = spyOn(notificationsService, "addNotifications");
    await service.mapToNotification(reminder1);
    expect(spy).toHaveBeenCalledWith(notifications);
  });

});