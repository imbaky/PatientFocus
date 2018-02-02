import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { Reminder } from '@services/reminders/reminders.interface';
import { RemindersService } from '@services/reminders/reminders.service';
import { NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { ReminderMethodType } from '@enum/reminder-method-type';

@Component({
    selector: 'reminder-component',
    templateUrl: 'reminder.html'
})
export class ReminderComponent {

    reminder: Reminder;
    reminderForm: FormGroup;
    minExpiryDate: string;
    reminderMethod: ReminderMethodType;
    oldReminder: Reminder; // The old reminder to delete if user decides to edit
    title: string;
    submit: string;

    constructor(
        public viewCtrl: ViewController,
        private formBuilder: FormBuilder,
        private reminderService: RemindersService,
        private navParams: NavParams
    ) {

        this.minExpiryDate = moment({}).format('YYYY-MM-DD');
        this.reminderForm = this.formBuilder.group({
            title: ['', Validators.required],
            text: ['', Validators.required],
            every: [1, Validators.required],
            frequencies: this.formBuilder.array([this.createTime()], Validators.required),
            expires: [moment().format('YYYY-MM-DD HH:mm:ss'), Validators.required]
        });
        this.reminderMethod = this.navParams.get('reminderMethod');
        this.title = this.reminderMethod.toString();
        this.submit = this.reminderMethod.toString();
        if (this.reminderMethod === ReminderMethodType.EDIT_REMINDER) {
          this.oldReminder = this.navParams.get('oldReminder');
          // re-populate form
          this.reminderForm.patchValue({
              title: this.oldReminder.title,
              text: this.oldReminder.text,
              every: this.oldReminder.frequencies.length,
              expires: this.oldReminder.expires
          });
          this.setFrequencies(this.oldReminder);
        }
    }

    async handleReminderForm() {

        // fill most of values
        this.reminder = this.reminderForm.getRawValue();
        // add unique reminder number, set to unix time NOTE: maybe not need anymore
        this.reminder.reminder_id = moment().unix();

        if (this.reminderMethod === ReminderMethodType.EDIT_REMINDER) { // delete original notification
          await this.reminderService.deleteReminder(this.oldReminder);
        }

        // save
        const reminder = await this.reminderService.createReminder(this.reminder);
        await this.reminderService.mapToNotification(this.reminder);

        this.dismiss();
    }

    /*
     * Created the nested form for frequencies.
     * Takes optional arguments depending if we are creating or editing
     * a reminder.
     */
    createTime(fTime?: string, fId?: number): FormGroup {
        // generate unique id
        const randomNum = Math.floor(Math.random() * moment().unix()) + 1;
        return this.formBuilder.group({
            frequency: [fTime || moment().format(), Validators.required],
            frequency_id: [fId || randomNum] // unique identifier
        });
    }

    handleFrequency(): void {
        // get value of 'every' field
        const everyCount = this.reminderForm.controls['every'].value;
        const frequencies = [];
        for (let i = 0; i < everyCount; i++) {
            frequencies.push(this.createTime());
        }
        // reset frequencies to new array size
        this.reminderForm.setControl('frequencies', new FormArray(frequencies));
    }

    /*
     * In Edit mode we need to fill in the frequencies
     * nested form.
     */
    setFrequencies(reminder: Reminder) {
        const frequencies = [];
        for (let i = 0; i < reminder.frequencies.length; i++) {
            frequencies.push(this.createTime(
                reminder.frequencies[i].frequency,
                reminder.frequencies[i].frequency_id
            ));
        }
        this.reminderForm.setControl('frequencies', new FormArray(frequencies));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
