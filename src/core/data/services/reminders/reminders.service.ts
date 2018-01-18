import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';
import Dexie from 'dexie';
import * as moment from 'moment';

import { ProfileService } from '../profile/profile.service';
import { Reminder } from './reminders.interface';

@Injectable()
export class RemindersService {

    table: Dexie.Table<Reminder, number>;

    constructor(
        private dexie: DexieService,
        private profileService: ProfileService
    ) {
        this.table = this.dexie.table('reminders');
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
}
