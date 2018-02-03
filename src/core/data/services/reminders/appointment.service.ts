import { Injectable } from '@angular/core';

import { DexieService } from '../dexie/dexie.service';
import Dexie from 'dexie';

import { RemindersService } from './reminders.service';
import { Appointment } from './reminders.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { ProfileService } from '../profile/profile.service';
import { notDeepEqual } from 'assert';

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
        // delete reminder and appointment

    }
}
