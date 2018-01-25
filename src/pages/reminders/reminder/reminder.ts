import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { Reminder } from '../../../core/data/services/reminders/reminders.interface';
import { RemindersService } from '../../../core/data/services/reminders/reminders.service';
import * as moment from 'moment';

@Component({
    selector: 'reminder-component',
    templateUrl: 'reminder.html'
})
export class ReminderComponent {

    reminder: Reminder;
    reminderForm: FormGroup;
    minExpiryDate: string;

    constructor(
        public viewCtrl: ViewController,
        private formBuilder: FormBuilder,
        private reminderService: RemindersService
    ) {
        this.minExpiryDate = moment({}).format('YYYY-MM-DD');
        this.reminderForm = this.formBuilder.group({
            title: ['', Validators.required],
            text: ['', Validators.required],
            every: [1, Validators.required],
            frequencies: this.formBuilder.array([this.createTime()], Validators.required),
            expires: [moment().format('YYYY-MM-DD HH:mm:ss'), Validators.required]
        });
    }

    async handleReminderForm() {

        // fill most of values
        this.reminder = this.reminderForm.getRawValue();
        // add unique reminder number, set to unix time NOTE: maybe not need anymore
        this.reminder.reminder_id = moment().unix();

        // save
        const reminder = await this.reminderService.createReminder(this.reminder);
        await this.reminderService.mapToNotification(this.reminder);

        this.dismiss();
    }

    createTime(): FormGroup {
        // generate unique id
        const randomNum = Math.floor(Math.random() * moment().unix()) + 1;
        return this.formBuilder.group({
            frequency: [moment().format(), Validators.required],
            frequency_id: [randomNum] // unique identifier
        });
    }

    handleFrequency(): void {
        // console.log(this.reminderForm.controls['every'].value);

        // get value of 'every' field
        const everyCount = this.reminderForm.controls['every'].value;
        const frequencies = [];
        for (let i = 0; i < everyCount; i++) {
            frequencies.push(this.createTime());
        }
        // reset frequencies to new array size
        this.reminderForm.setControl('frequencies', new FormArray(frequencies));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
