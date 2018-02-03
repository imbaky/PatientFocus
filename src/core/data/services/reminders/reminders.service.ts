import { Injectable } from '@angular/core';

import { Reminders, Reminder, Appointment } from './reminders.interface';
import { ReminderType } from '@enum/reminder-method-type';
import { ReminderService } from './reminder.service';
import { AppointmentService } from './appointment.service';

@Injectable()
export class RemindersService {

    allReminders: Reminders[];

    constructor(
        private reminderService: ReminderService,
        private appointmentService: AppointmentService
    ) {

    }

    /*
     * Get reminders by profile id
     */
    async getReminders(profile_id: number): Promise<Reminders[]> {
        const reminders = await this.reminderService.getReminders(profile_id);
        const appointments = await this.appointmentService.getAppointments(profile_id);
        return this.allReminders.concat(reminders, appointments);
    }

    async deleteReminder(reminder: Reminders) {
        // delete notification
        switch (reminder.reminder_type) {
            case ReminderType.Medication: {
                const reminderClass = <Reminder> reminder;
                await this.reminderService.deleteReminder(reminderClass);
                break;
            }
            case ReminderType.Appointment: {
                const reminderClass = <Appointment> reminder;
                await this.appointmentService.deleteAppointment(reminderClass);
                break;
            }
        }
    }
}
