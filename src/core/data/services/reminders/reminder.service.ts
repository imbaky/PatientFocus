import { Injectable } from '@angular/core';
import { ILocalNotification } from '@ionic-native/local-notifications';

import { DexieService } from '../dexie/dexie.service';
import Dexie from 'dexie';
import * as moment from 'moment';


import { RemindersService } from './reminders.service';
import { Reminders, Reminder } from './reminders.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ReminderService {

    table: Dexie.Table<Reminder, number>;
    notifications: Array<ILocalNotification>;

    constructor(
        private dexie: DexieService,
        private notificationsService: NotificationsService,
        private profileService: ProfileService
    ) {
        // super(dexie, notificationsService, profileService);
        this.table = this.dexie.table('reminder');
        this.notifications = [];
    }

    async createReminder(reminder: Reminder) {
        // TODO: get current profile not just first one
        reminder.fk_profile_id = await this.profileService.getFirstProfileId();
        const pk = await this.table.add(reminder);
        reminder.id = pk;
        return reminder;
    }

    /*
     * Get reminders by profile id
     */
    async getReminders(profile_id: number): Promise<Reminder[]> {
        const reminders = await this.table.filter(function (reminder) {
            return reminder.fk_profile_id === profile_id;
        }).toArray();
        return reminders;
    }

    async deleteReminder(reminder: Reminder) {
        // delete notification
        for (let i = 0; i < reminder.frequencies.length; i++) {
          const r = this.notificationsService.deleteNotification(reminder.frequencies[i].frequency_id);
        }
        await this.table.delete(reminder.id);
    }

    /*
     * Map a reminder object to notifications
     */
    mapToNotification(newReminder: Reminder) {
        let note = {};
        // map to notification
        for (let i = 0; i < newReminder.frequencies.length; i++) {
            const expire = moment(newReminder.expires);
            const numberOfDaysToRepeat = expire.diff(moment().format(), 'days') + 1; // number of days between today and expire
            const reminderTime = moment(newReminder.frequencies[i].frequency);
            const hour = reminderTime.hour();
            const min = reminderTime.minute();
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
        return this.notifications;
    }
}
