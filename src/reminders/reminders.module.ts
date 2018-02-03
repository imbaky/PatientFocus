import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { RemindersPage } from '../pages/reminders/reminders';
import { ReminderComponent } from '../pages/reminders/reminder/reminder';
import { RemindersService } from '../core/data/services/reminders/reminders.service';
import { ReminderService } from '../core/data/services/reminders/reminder.service';
import { AppointmentService } from '../core/data/services/reminders/appointment.service';
import { AppointmentComponent } from '../pages/reminders/appointment/appointment';
import { NotificationsService } from '../core/data/services/notifications/notifications.service';

@NgModule({
    declarations: [
        RemindersPage,
        ReminderComponent,
        AppointmentComponent
    ],
    imports: [
      CommonModule,
      IonicModule.forRoot(RemindersPage)
    ],
    exports: [
      RemindersPage,
      ReminderComponent,
      AppointmentComponent
    ],
    entryComponents: [
      ReminderComponent,
      AppointmentComponent
    ],
    providers: [
      LocalNotifications,
      RemindersService,
      ReminderService,
      AppointmentService,
      NotificationsService
    ]
  })
  export class RemindersModule { }
