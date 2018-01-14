import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { Diary, DiaryService } from '../../core/data/services/diary/diary.service';
import { ProfileService } from '../../core/data/services/profile/profile.service';

import { AddEntryPage } from './add-entry/add-entry';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})

export class DiaryPage {
  diary$: Promise<Diary>;

  constructor(
    public modalCtrl: ModalController,
    private diaryService: DiaryService,
    private profileService: ProfileService
  ) {
    this.profileService.getFirstProfileId().then(profileId => {
      this.diary$ = this.diaryService.getDiaryById(profileId);
    });
  }

  addEntry(directory: Diary) {
    const addEntryModal = this.modalCtrl.create(AddEntryPage);
    addEntryModal.present();
  }

}