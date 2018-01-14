import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { DiaryPage } from '../diary/diary';
import { AddEntryPage } from '../diary/add-entry/add-entry';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(DiaryPage),
    IonicModule.forRoot(AddEntryPage)
  ],
  declarations: [
    DiaryPage,
    AddEntryPage
  ],
  exports: [
    DiaryPage,
    AddEntryPage
  ]
})
export class DiaryModule { }
