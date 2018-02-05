import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { Appointment } from '../../../core/data/services/reminders/reminders.interface';
import { AppointmentService } from '../../../core/data/services/reminders/appointment.service';
import { ReminderType } from '../../../core/data/enum/reminder-method-type';

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
    }

    async handleAppointmentForm() {

        this.appointment = this.appointmentForm.getRawValue();
        // generate unique ids
        this.appointment.appointment_id = moment().unix() + 1;
        this.appointment.reminder_id = moment().unix() + 2;

        this.appointment.reminder_type = ReminderType.Appointment;
        // save
        await this.appointmentService.createAppointment(this.appointment);
        this.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
