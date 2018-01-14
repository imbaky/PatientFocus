import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { DirectoryService } from '../directory/directory.service';
import { DiaryService } from '../diary/diary.service';

export interface UserProfile {
  id?: number;
  directory: number;
  diary: number;
  name: string;
  password: string;
}

@Injectable()
export class ProfileService {
  table: Dexie.Table<UserProfile, number>;

  constructor(
    private dexie: DexieService,
    private directoryService: DirectoryService,
    private diaryService: DiaryService
  ) {
    this.table = this.dexie.table('profile');
  }

  async getProfileById(id: number): Promise<UserProfile> {
    return this.table.get(id);
  }

  /**
   * Saves a new profile and attaches a new directory and diary with the same id
   * @param profile object form
   * @returns {Promise<number>}
   */
  async save(profile: any) {
    let newProfile = {
      directory: null,
      diary: null,
      name: profile.name,
      password: profile.password
    };
    const profileId = await this.table.put(newProfile);
    const directoryId = await this.directoryService.createNewDirectory(
      profileId
    );
    const diaryId = await this.diaryService.createNewDiary(profileId);
    newProfile = await this.table.get(profileId);
    newProfile.directory = directoryId;
    newProfile.diary = diaryId;
    return await this.table.put(newProfile);
  }

  /**
   * Retrieve first profile in the database
   * @returns {Promise<R>}
   */
  getFirstProfile(): Promise<UserProfile> {
    return this.table.toArray(profile => {
      return profile[0];
    });
  }

  async getFirstProfileId() {
    const array = await this.table.toArray();
    return array[0].id;
  }

  clearDb() {
    this.table.clear();
  }
}
