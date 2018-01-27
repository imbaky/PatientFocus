import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { Reminder } from '../../core/data/services/reminders/reminders.interface';
import { ReminderComponent } from './reminder/reminder';
import { RemindersService } from '../../core/data/services/reminders/reminders.service';
import { NotificationsService } from '../../core/data/services/notifications/notifications.service';
import { ProfileService } from '../../core/data/services/profile/profile.service';
import {ReminderMethodType} from "../../core/data/enum/reminder-method-type";

@Component({
    selector: 'page-reminders',
    templateUrl: 'reminders.html'
})
export class RemindersPage {

    reminders: Reminder[];
    profile_id: number;

    constructor(
        public modalCtrl: ModalController,
        private remindersService: RemindersService,
        private notificationsService: NotificationsService,
        private profileService: ProfileService
    ) {
        (
            async() => {
                // TODO: get current profile not just first one
                this.profile_id = await this.profileService.getFirstProfileId();
                this.getReminders();
            }
        )();
    }

    async getReminders() {
        this.reminders = await this.remindersService.getReminders(this.profile_id);
    }

    addReminder() {
      let reminderMethod = ReminderMethodType.CREATE_REMINDER;
      const reminderModal = this.modalCtrl.create(ReminderComponent, { reminderMethod });
        reminderModal.onDidDismiss(() => {
            this.getReminders();
        });
        reminderModal.present();
    }

    editReminder(reminder: Reminder) {
      let reminderMethod = ReminderMethodType.EDIT_REMINDER;
      let oldReminder = reminder;
      const reminderModal = this.modalCtrl.create(ReminderComponent, { reminderMethod, oldReminder });
      reminderModal.onDidDismiss(() => {
        this.getReminders();
      });
      reminderModal.present();
      // deleteReminder(reminder: Reminder) if they accept the new reminder
    }

    async deleteReminder(reminder: Reminder) {

        // delete from database
        await this.remindersService.deleteReminder(reminder);
        // refresh list
        this.getReminders();
    }

}
