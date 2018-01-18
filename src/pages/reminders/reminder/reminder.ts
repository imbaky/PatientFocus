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

    constructor(
        public viewCtrl: ViewController,
        private formBuilder: FormBuilder,
        private reminderService: RemindersService
    ) {
        this.reminderForm = this.formBuilder.group({
            title: ['', Validators.required],
            text: ['', Validators.required],
            at: [moment().format('YYYY-MM-DD HH:mm:ss'), Validators.required],
            every: [1, Validators.required],
            frequencies: this.formBuilder.array([this.createTime()], Validators.required),
            expires: [moment().format('YYYY-MM-DD HH:mm:ss'), Validators.required]
        });
    }

    async handleReminderForm() {

        // fill most of values
        this.reminder = this.reminderForm.getRawValue();
        console.log(this.reminder);
        // add unique reminder number
        this.reminder.reminder_id = 1;
        // reformat date?

        // save
        await this.reminderService.createReminder(this.reminder);

        this.dismiss();
    }

    createTime(): FormGroup {
        return this.formBuilder.group({
            frequency: ['', Validators.required]
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
