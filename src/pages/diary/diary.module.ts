import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { DiaryPage } from '@pages/diary/diary';
import { AddEntryPage } from '@pages/diary/add-entry/add-entry';
import { EditEntryPage } from '@pages/diary/edit-entry/edit-entry';
import { DetailedView } from '@components/detailed-view/detailed-view.component';
import { DiaryFilterByTerm, DiaryFilterByDate } from '@pages/diary/pipes/diary-filter/diary-filter.pipe';
@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(DiaryPage),
    IonicModule.forRoot(AddEntryPage),
    IonicModule.forRoot(DetailedView),
    IonicModule.forRoot(EditEntryPage),
  ],
  declarations: [
    DiaryPage,
    AddEntryPage,
    DetailedView,
    DiaryFilterByTerm,
    DiaryFilterByDate,
    DetailedView,
    EditEntryPage
  ],
  exports: [
    DiaryPage,
    AddEntryPage,
    DetailedView,
    EditEntryPage
  ]
})
export class DiaryModule { }
