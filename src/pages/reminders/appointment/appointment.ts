import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { Appointment } from '@services/reminders/reminders.interface';
import { AppointmentService } from '@services/reminders/appointment.service';
import { ReminderType } from '@enum/reminder-method-type';

@Component({
    selector: 'appointment-component',
    templateUrl: 'appointment.html'
})
export class AppointmentComponent {

    appointment: Appointment;
    appointmentForm: FormGroup;
    minExpiryDate: string;

    constructor(
        public viewCtrl: ViewController,
        private formBuilder: FormBuilder,
        private appointmentService: AppointmentService,
        private navParams: NavParams
    ) {
        this.minExpiryDate = moment({}).format('YYYY-MM-DD');

        this.appointmentForm = this.formBuilder.group({
            title: ['', Validators.required],
            doctor: ['', Validators.required],
            address: ['', Validators.required],
            note: [''], // Optional
            date: [moment().format('YYYY-MM-DD'), Validators.required],
            time: [moment().format(), Validators.required],
            reminder: [1, Validators.required]
        });

        // check if we are editing
        this.appointment = this.navParams.get('appointment');
        if (this.appointment) {
            this.editAppointment();
        }
    }

    async handleAppointmentForm() {
        if (this.appointment) {
            // coming from edit so delete old one
            await this.appointmentService.deleteAppointment(this.appointment);
        }

        this.appointment = this.appointmentForm.getRawValue();
        // generate unique ids
        this.appointment.appointment_id = moment().unix() + 1;
        this.appointment.reminder_id = moment().unix() + 2;

        this.appointment.reminder_type = ReminderType.Appointment;
        // save
        await this.appointmentService.createAppointment(this.appointment);
        this.appointmentService.mapToNotification(this.appointment);
        this.dismiss();
    }

    editAppointment() {
        this.appointmentForm.patchValue({
            title: this.appointment.title,
            doctor: this.appointment.doctor,
            address: this.appointment.address,
            note: this.appointment.note,
            date: this.appointment.date,
            time: this.appointment.time,
            reminder: this.appointment.reminder
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
