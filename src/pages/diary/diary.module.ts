import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { DiaryPage } from '@pages/diary/diary';
import { AddEntryPage } from '@pages/diary/add-entry/add-entry';
import { DetailedView } from '@components/detailed-view/detailed-view';
@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(DiaryPage),
    IonicModule.forRoot(AddEntryPage),
    IonicModule.forRoot(DetailedView)
  ],
  declarations: [
    DiaryPage,
    AddEntryPage,
    DetailedView
  ],
  exports: [
    DiaryPage,
    AddEntryPage,
    DetailedView
  ]
})
export class DiaryModule { }
