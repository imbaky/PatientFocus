import { SCHEMA } from '@services/dexie/database';
import { ReminderType } from '@enum/reminder-method-type';
import Dexie from 'dexie';
import { FileFormatType, PortfolioType } from '@enum/file-type.enum';
import { PageType } from '@enum/page-type.enum';
import * as moment from 'moment';
import { File } from '@interfaces/file/file';

export class DATABASE extends Dexie {
  constructor() {
    super('generic_test');
    this.version(1).stores(SCHEMA);
    this.on('populate', () => {
      this.addItems();
      this.addAppointments();
      this.addFiles();
      this.addProfile();
      this.addReminders();
    });
  }

  addItems() {
    const date = new Date();
    const items = [
      {
        title: 'Health Problems1',
        directory_id: 1,
        description: 'lab test1',
        file_id: 1,
        page: PageType.Portfolio,
        chosen_date: '2018-01-01',
        document_type: PortfolioType.DIAGNOSIS,
        created: date
      },
      {
        title: 'Health Problems2',
        directory_id: 1,
        description: 'lab test1',
        file_id: 2,
        page: PageType.Portfolio,
        chosen_date: '2018-01-01',
        document_type: PortfolioType.DIAGNOSIS,
        created: date
      },
      {
        title: 'Health Problems3',
        description: 'lab test1',
        directory_id: 1,
        file_id: 3,
        page: PageType.Portfolio,
        chosen_date: '2018-01-01',
        document_type: PortfolioType.DIAGNOSIS,
        created: date
      }
    ];
    this.table('item').bulkAdd(items);
  }

  addFiles() {

    const files: File[] = [
      {
        id: 1,
        path: '::directory/subdirectory/subsubdirectory1',
        size: 885421,
        format: FileFormatType.JPG,
        file_name: 'filename1'
      },
      {
        id: 2,
        path: '::directory/subdirectory/subsubdirectory1',
        size: 885421,
        format: FileFormatType.JPG,
        file_name: 'filename2'
      },
      {
        id: 3,
        path: '::directory/subdirectory/subsubdirectory1',
        size: 885421,
        format: FileFormatType.JPG,
        file_name: 'filename3'
      }
    ];
    this.table('file').bulkAdd(files);
  }

  addAppointments() {
    const appointments = [{
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
    }];
    this.table('appointment').bulkAdd(appointments);
  }

  addReminders() {
    const reminders = [
      {
        id: 1,
        reminder_id: 10,
        reminder_type: ReminderType.Medication,
        fk_profile_id: 1,
        title: 'Reminder1',
        text: 'Reminder1 text',
        frequencies: [
          {
            frequency: '2018-01-24T1:00:00-05:00',
            frequency_id: 100
          },
          {
            frequency: '2018-01-24T2:00:00-05:00',
            frequency_id: 101
          }
        ],
        expires: '2018-01-28T00:00:00-05:00'
      },
      {
        id: 2,
        reminder_id: 11,
        reminder_type: ReminderType.Medication,
        fk_profile_id: 1,
        title: 'Reminder2',
        text: 'Reminder2 text',
        frequencies: [
          {
            frequency: '2018-01-24T14:00:00-05:00',
            frequency_id: 102
          },
        ],
        expires: '2018-01-26T00:00:00-05:00'
      },
      {
        id: 3,
        reminder_id: 12,
        reminder_type: ReminderType.Medication,
        fk_profile_id: 1,
        title: 'Reminder3',
        text: 'Reminder3 text',
        frequencies: [
          {
            frequency: '2018-01-24T14:00:00-05:00',
            frequency_id: 103
          },
          {
            frequency: '2018-01-24T15:00:00-05:00',
            frequency_id: 104
          }
        ],
        expires: '2018-01-25T00:00:00-05:00'
      },
      {
        id: 10,
        reminder_id: 112,
        reminder_type: ReminderType.Medication,
        fk_profile_id: 10,
        title: 'Reminder10',
        text: 'Another profile',
        frequencies: [
          {
            frequency: '2018-01-24T16:00:00-05:00',
            frequency_id: 1000
          },
          {
            frequency: '2018-01-24T17:00:00-05:00',
            frequency_id: 2000
          }
        ],
        expires: '2018-01-25T00:00:00-05:00'
      }
    ];
    this.table('reminder').bulkAdd(reminders);
  }

  addProfile() {
    const profile = [{
      id: 1,
      directory: 1,
      name: 'Deez Nuts',
      password: 'password',
      gender: 'male',
      dob: '2018-04-01'
    }];
    this.table('profile').bulkAdd(profile);
  }
}
