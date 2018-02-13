import { ReminderType } from 'core/data/enum/reminder-method-type';

export interface Reminders {
    id?: number;
    reminder_id: number;
    fk_profile_id: number;
    title: string;
    reminder_type: ReminderType;
}

export interface Reminder extends Reminders {
    text: string;
    frequencies: any;
    expires: string;
}

export interface Appointment extends Reminders {
    appointment_id: number;
    doctor: string;
    address: string;
    note: string;
    date: string;
    time: string;
    reminder: number;
}
