import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { DiaryPage } from '../diary/diary';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(DiaryPage)
  ],
  declarations: [
    DiaryPage,
  ],
  exports: [
    DiaryPage,
  ]
})
export class DiaryModule { }
