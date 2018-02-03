import { Component } from '@angular/core';
import { ModalController, ActionSheetController } from 'ionic-angular';

import { Reminders } from '@services/reminders/reminders.interface';
import { ReminderComponent } from './reminder/reminder';
import { AppointmentComponent } from './appointment/appointment';
import { RemindersService } from '@services/reminders/reminders.service';
import { ProfileService } from '@services/profile/profile.service';
import { ReminderMethodType, ReminderType } from '@enum/reminder-method-type';

@Component({
    selector: 'page-reminders',
    templateUrl: 'reminders.html'
})
export class RemindersPage {

    reminders: Reminders[];
    profile_id: number;
    reminderType = ReminderType;

    constructor(
        public modalCtrl: ModalController,
        public actionSheetCtrl: ActionSheetController,
        private remindersService: RemindersService,
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
        // this will get both reminder and appointment
        this.reminders = await this.remindersService.getReminders(this.profile_id);
    }

    handleReminderType(method: ReminderType) {
        let reminderModal;
        if (method === ReminderType.Medication) {
            const reminderMethod = ReminderMethodType.CREATE_REMINDER;
            reminderModal = this.modalCtrl.create(ReminderComponent, { reminderMethod });
        }
        if (method === ReminderType.Appointment) {
            reminderModal = this.modalCtrl.create(AppointmentComponent, {});
        }
        reminderModal.onDidDismiss(async () => {
            this.getReminders();
        });
        reminderModal.present();
    }

    addReminder() {
        const actionSheet = this.actionSheetCtrl.create({
            title: 'Reminder Type',
            buttons: [
              {
                text: 'Medication',
                icon: 'md-bookmarks',
                handler: this.handleReminderType.bind(this, ReminderType.Medication)
              },
              {
                text: 'Appointment',
                icon: 'md-calendar',
                handler: this.handleReminderType.bind(this, ReminderType.Appointment)
              },
              {
                text: 'Cancel',
                role: 'cancel',
                icon: 'md-close'
              }
            ]
        });
        actionSheet.present();
    }

    editReminder(reminder: Reminders) {
      const reminderMethod = ReminderMethodType.EDIT_REMINDER;
      const oldReminder = reminder;
      const reminderModal = this.modalCtrl.create(ReminderComponent, { reminderMethod, oldReminder });
      reminderModal.onDidDismiss(() => {
        this.getReminders();
      });
      reminderModal.present();
      // deleteReminder(reminder: Reminder) if they accept the new reminder
    }

    async deleteReminder(reminder: Reminders) {

        // delete from database
        await this.remindersService.deleteReminder(reminder);
        // refresh list
        this.getReminders();
    }

}
