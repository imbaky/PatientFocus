import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { DiaryPage } from '@pages/diary/diary';
import { AddEntryPage } from '@pages/diary/add-entry/add-entry';
import { DetailedView } from '@components/detailed-view/detailed-view.component';
import { DiaryFilterByTerm } from '@pages/diary/pipes/diary-filter/diary-filter.pipe';
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
    DetailedView,
    DiaryFilterByTerm
  ],
  exports: [
    DiaryPage,
    AddEntryPage,
    DetailedView
  ]
})
export class DiaryModule { }
