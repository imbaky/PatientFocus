import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { RemindersPage } from '../pages/reminders/reminders';
import { ReminderComponent } from '../pages/reminders/reminder/reminder';
import { RemindersService } from '../core/data/services/reminders/reminders.service';

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
      RemindersService
    ]
  })
  export class RemindersModule { }
