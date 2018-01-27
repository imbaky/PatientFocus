import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { RemindersPage } from '../pages/reminders/reminders';
import { ReminderComponent } from '../pages/reminders/reminder/reminder';
import { RemindersService } from '../core/data/services/reminders/reminders.service';
import { NotificationsService } from '../core/data/services/notifications/notifications.service';

@NgModule({
    declarations: [
        RemindersPage,
        ReminderComponent
    ],
    imports: [
      CommonModule,
      IonicModule.forRoot(RemindersPage)
    ],
    exports: [
      RemindersPage,
      ReminderComponent
    ],
    entryComponents: [
      ReminderComponent
    ],
    providers: [
      LocalNotifications,
      RemindersService,
      NotificationsService
    ]
  })
  export class RemindersModule { }
