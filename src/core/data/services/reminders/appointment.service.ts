import { Injectable } from '@angular/core';
import { ILocalNotification } from '@ionic-native/local-notifications';
import * as moment from 'moment';

import { DexieService } from '@services/dexie/dexie.service';
import Dexie from 'dexie';

import { RemindersService } from '@services/reminders/reminders.service';
import { Appointment } from '@services/reminders/reminders.interface';
import { NotificationsService } from '@services/notifications/notifications.service';
import { ProfileService } from '@services/profile/profile.service';

@Injectable()
export class AppointmentService {

    table: Dexie.Table<Appointment, number>;

    constructor(
        private dexie: DexieService,
        private notificationsService: NotificationsService,
        private profileService: ProfileService
    ) {
        // super(dexie, notificationsService, profileService);
        this.table = this.dexie.table('appointment');
    }

    async createAppointment(appointment: Appointment) {
        appointment.fk_profile_id = await this.profileService.getFirstProfileId();
        const pk = await this.table.add(appointment);
        appointment.id = pk;
        return appointment;
    }

    async getAppointments(profile_id: number): Promise<Appointment[]> {
        const appointments = await this.table.filter(function (appointment) {
            return appointment.fk_profile_id === profile_id;
        }).toArray();
        return appointments;
    }

    async deleteAppointment(appointment: Appointment) {
        // delete reminder and appointment from notifications
        this.notificationsService.deleteNotification(appointment.reminder_id);
        this.notificationsService.deleteNotification(appointment.appointment_id);

        await this.table.delete(appointment.id);
    }

    /*
     * Need to create two notifications:
     * 1. to remind X number of days before
     * 2. the actual appointment
     */
    mapToNotification(appointment: Appointment) {
        let note = {};
        const notifications = new Array<ILocalNotification>();
        // prepare
        const triggerDate = moment(appointment.date);
        const triggerTime = moment(appointment.time);
        triggerDate.set({
            'hour': triggerTime.get('hour'),
            'minute': triggerTime.get('minute')
        });
        const reminderDate = moment(triggerDate).subtract(appointment.reminder, 'days');
        // reminder first
        note = {
            id: appointment.reminder_id,
            title: appointment.title,
            text: 'Appointment in ' + appointment.reminder + ' day(s)',
            trigger: { at: reminderDate.toDate() }
        };
        notifications.push(note);
        note = {};
        // the appointment
        note = {
            id: appointment.appointment_id,
            title: appointment.title,
            text: appointment.doctor + ' ' + appointment.address + ' ' + appointment.note,
            trigger: { at: triggerDate.toDate() }
        };
        notifications.push(note);
        // console.log(notifications);
        // send to notification service
        this.notificationsService.addNotifications(notifications);
        return notifications;
    }
}
