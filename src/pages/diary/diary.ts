import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import * as moment from 'moment';

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

  dateFromTerm: string;
  dateToTerm: string;
  dateMaxDate: string;

  constructor(
    public modalCtrl: ModalController,
    private profileService: ProfileService,
    private navCtrl: NavController,
    private directoryService: DirectoryService
  ) {
    // set date to today by default
    // otherwise format is {year: 2017, month: 0, day: 1}
    // the webpage for moment.js has more information
    this.dateFromTerm = this.getDate({ year: 2005, month: 0, day: 1 }); // set start date to be long ago to include all files by default
    this.dateToTerm = this.getDate({});
    this.dateMaxDate = this.getDate({});

    this.profileService.getFirstProfileId().then(async (profileId) => { // TODO need to get actual profile id
      this.items$ = this.profileService.getProfileDiaryItems(profileId);
      this.directory = await this.directoryService.getDirectoryById(profileId);
    });
  }

  getDate(chosen_date) {
    const d = moment(chosen_date);
    // keeping with ISO 8601 format as far as year month day is concerned
    return d.format('YYYY-MM-DD');
  }

  filterToggle() {
    // we want to hide the add entry button
    const addButton = document.getElementById('addButton');
    if (addButton.style.visibility === 'hidden') {
      addButton.style.visibility = '';
      return;
    }
    addButton.style.visibility = 'hidden';
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
