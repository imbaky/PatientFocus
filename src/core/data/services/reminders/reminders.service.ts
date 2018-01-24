import { Injectable } from '@angular/core';
import { ILocalNotification } from '@ionic-native/local-notifications';

import { DexieService } from '../dexie/dexie.service';
import Dexie from 'dexie';
import * as moment from 'moment';

import { NotificationsService } from '../notifications/notifications.service';
import { ProfileService } from '../profile/profile.service';
import { Reminder } from './reminders.interface';

@Injectable()
export class RemindersService {

    table: Dexie.Table<Reminder, number>;
    notifications: Array<ILocalNotification>;

    constructor(
        private dexie: DexieService,
        private notificationsService: NotificationsService,
        private profileService: ProfileService
    ) {
        this.table = this.dexie.table('reminders');
        this.notifications = [];
    }

    async createReminder(reminder: Reminder) {
        // TODO: get current profile not just first one
        reminder.fk_profile_id = await this.profileService.getFirstProfileId();
        // change dates from UTC

        const pk = await this.table.add(reminder);
        reminder.id = pk;

        return reminder;
    }

    async getReminders(): Promise<Reminder[]> {
        const reminders = await this.table.toArray();
        return reminders;
    }

    async deleteReminder(id: number) {
        await this.table.delete(id);
    }

    mapToNotification(newReminder: Reminder) {

        let note = {};
        // map to notification
        for (let i = 0; i < newReminder.frequencies.length; i++) {
          let expire = moment(newReminder.expires);
          let numberOfDaysToRepeat = expire.diff(moment().format(), "days") + 2; // number of days between today and expire
          let hour = parseInt(moment(newReminder.frequencies[i].frequency).format("HH").toString());
          let min = parseInt(moment(newReminder.frequencies[i].frequency).format("mm").toString());
          note = {
                id: newReminder.frequencies[i].frequency_id,
                text: newReminder.text,
                title: newReminder.title,
                trigger: { every: {hour: hour, minute: min}, count: numberOfDaysToRepeat}
            };
            this.notifications.push(note);
            note = {};
        }

        // send to notification service
        this.notificationsService.addNotifications(this.notifications);
    }
}
