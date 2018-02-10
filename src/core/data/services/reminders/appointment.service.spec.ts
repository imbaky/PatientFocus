import { async, TestBed } from '@angular/core/testing';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';

import { AppointmentService } from '@services/reminders/appointment.service';
import { ReminderType } from '@enum/reminder-method-type';
import { DexieService } from '@services/dexie/dexie.service';
import { ProfileService } from '@services/profile/profile.service';
import { DirectoryService } from '@services/directory/directory.service';
import { ItemService } from '@services/item/item.service';
import { FileService } from '@services/file/file.service';

import Dexie from 'dexie';
import { SCHEMA } from '@services/dexie/database';
import { Appointment } from '@services/reminders/reminders.interface';
import { NotificationsService } from '@services/notifications/notifications.service';
import * as moment from 'moment';
import { Events } from 'ionic-angular';

class DATABASE extends Dexie {
    constructor() {
        super('appointment_test');

        this.version(1).stores(SCHEMA);

        this.on('populate', () => {
            this.table('profile').add({
                id: 1,
                directory: 1,
                name: 'name',
                password: 'password'
            });
            this.table('appointment').bulkAdd([
                {
                    id: 1,
                    appointment_id: 10,
                    fk_profile_id: 1,
                    reminder_type: ReminderType.Appointment,
                    title: 'Check up1',
                    doctor: 'Dr. Smith',
                    address: '1234 Main Street',
                    note: '',
                    date: moment().format('YYYY-MM-DD'),
                    time: moment().format('HH:mm'),
                    reminder: 1,
                    reminder_id: 11
                },
                {
                    id: 2,
                    appointment_id: 20,
                    fk_profile_id: 1,
                    reminder_type: ReminderType.Appointment,
                    title: 'Check up2',
                    doctor: 'Dr. Smith',
                    address: '4321 Main Street',
                    note: 'Bring X-Ray',
                    date: moment().format('YYYY-MM-DD'),
                    time: moment().format('HH:mm'),
                    reminder: 2,
                    reminder_id: 21
                },
                {
                    id: 3,
                    appointment_id: 30,
                    fk_profile_id: 10,
                    reminder_type: ReminderType.Appointment,
                    title: 'Check up3',
                    doctor: 'Dr. Smith',
                    address: '55 Crescent Street',
                    note: '',
                    date: moment().format('YYYY-MM-DD'),
                    time: moment().format('HH:mm'),
                    reminder: 3,
                    reminder_id: 31
                }
            ]);
        });
    }
}

const testBedSetup = {
    providers: [
        AppointmentService,
        LocalNotifications,
        NotificationsService,
        ProfileService,
        {
            provide: DexieService,
            useClass: DATABASE
        },
        DirectoryService,
        ItemService,
        FileService,
        Events
    ]
};

describe('AppointmentService TestBed', () => {
    let appointmentService: AppointmentService;
    let dexieService: DexieService;
    let profileService: ProfileService;
    let notificationsService: NotificationsService;
    let mockDatabase = new DATABASE();

    beforeEach( async() => {
        mockDatabase = new DATABASE();
        const bed = TestBed.configureTestingModule(testBedSetup);
        TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
        dexieService = bed.get(DexieService);
        profileService = bed.get(ProfileService);
        appointmentService = bed.get(AppointmentService);
        notificationsService = bed.get(NotificationsService);
    });

    afterAll( async() => {
        mockDatabase.delete();
        mockDatabase = new DATABASE();
        TestBed.overrideProvider(DexieService, {useValue: mockDatabase});
    });

    it('GIVEN profile 1 THEN 2 of 3 appointments should be returned.', async() => {
        const appointments = await appointmentService.getAppointments(1);
        expect(appointments.length).toEqual(2);
        expect(appointments[0].appointment_id).toEqual(10);
        expect(appointments[1].appointment_id).toEqual(20);
    });

    it('GIVEN profile 10 THEN 1 of 3 appointments should be returned.', async() => {
        const appointments = await appointmentService.getAppointments(10);
        expect(appointments.length).toEqual(1);
        expect(appointments[0].appointment_id).toEqual(30);
    });

    it('Given a created appointment it can be deleted.', async () => {
        const appointment: Appointment = {
            appointment_id: 21,
            fk_profile_id: 1,
            reminder_type: ReminderType.Appointment,
            title: 'Blood Test',
            doctor: 'Dr. Strange',
            address: '100 Broad Street',
            note: '',
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm'),
            reminder: 2,
            reminder_id: 221
        };
        const newAppointment = await appointmentService.createAppointment(appointment);
        let appointments = await appointmentService.getAppointments(1);
        expect(appointments.length).toEqual(3);

        await appointmentService.deleteAppointment(newAppointment);
        appointments = await appointmentService.getAppointments(1);
        expect(appointments.length).toEqual(2);
    });

});
