import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { ProfileService, UserProfile } from '@services/profile/profile.service';
import { ItemService, Item } from '@services/item/item.service';
import { AddEntryPage } from './add-entry/add-entry';
import { DetailedView } from '@components/detailed-view/detailed-view.component';
import { Directory, DirectoryService } from '@services/directory/directory.service';
import { PageType } from '@enum/page-type.enum';

@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html'
})

export class DiaryPage {
  items$: Promise<Item[]>;
  directory: Directory;
  PageType = PageType;

  constructor(
    public modalCtrl: ModalController,
    private profileService: ProfileService,
    private navCtrl: NavController,
    private directoryService: DirectoryService
  ) {
    this.profileService.getFirstProfileId().then(async (profileId) => { // TODO need to get actual profile id
      this.items$ = this.profileService.getProfileDiaryItems(profileId);
      this.directory = await this.directoryService.getDirectoryById(profileId);
    });
  }

  async addEntry(itemsToSend: Item[]) {
    const items = await itemsToSend;
    const addEntry = this.modalCtrl.create(AddEntryPage, { directory: this.directory, items});
    addEntry.present();
  }

  viewDetails(event: any, entry: Item) {
    if (entry.file) {
      this.navCtrl.push(DetailedView, {
        title: entry.title, description: entry.description,
        date: entry.chosen_date, imgSrc: entry.file.path
      });
    } else {
      this.navCtrl.push(DetailedView, {
        title: entry.title, description: entry.description,
        date: entry.chosen_date
      });
    }
  }

}
