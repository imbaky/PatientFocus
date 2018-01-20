import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { Diary, DiaryService } from '../../core/data/services/diary/diary.service';
import { ProfileService } from '../../core/data/services/profile/profile.service';
import { ItemService, Item } from '../../core/data/services/item/item.service';
import { AddEntryPage } from './add-entry/add-entry';
import { DetailedView } from '../../components/detailed-view/detailed-view';
import { DiaryEntry } from '../../core/data/services/diary-entry/diary-entry.service';
import { Directory, DirectoryService } from '../../core/data/services/directory/directory.service';
import { PageType } from '../../core/data/enum/page-type.enum';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})

export class DiaryPage {
  diary$: Promise<Diary>;
  directory: Directory;
  PageType = PageType;

  constructor(
    public modalCtrl: ModalController,
    private diaryService: DiaryService,
    private profileService: ProfileService,
    private navCtrl: NavController,
    private directoryService: DirectoryService
  ) {
    this.profileService.getFirstProfileId().then(async (profileId) => { //TODO need to get actual profile id
      console.log(profileId);
      this.directory = await this.directoryService.getDirectoryById(profileId);
      console.log("directory", this.directory);
    });
  }

  addEntry(directory: Directory) {
    const addEntryModal = this.modalCtrl.create(AddEntryPage, { directory });
    addEntryModal.present();
  }

  viewDetails(event: any, entry: Item) {
    console.log("entry",entry);
    this.navCtrl.push(DetailedView, { title: entry.title, description: entry.description, date: entry.chosen_date });
  }

}
