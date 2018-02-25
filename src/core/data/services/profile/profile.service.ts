import { MD5 , SHA256} from 'crypto-js';
import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { DirectoryService } from '../directory/directory.service';
import { Events } from 'ionic-angular';
import { FileSystemService } from '@services/file-system/file-system.service';
import { BackupDBService } from '@services/backup/backup-db.service';
import { ItemService} from '../item/item.service';
import {Item} from '@interfaces/item/item';


export interface UserProfile {
  id?: number;
  directory: number;
  name: string;
  password: string;
  salt: string;
  emergency_contact_id?: number;
  gender?: string;
  dob?: string;
}

@Injectable()
export class ProfileService {
  table: Dexie.Table<UserProfile, number>;

  constructor(
    private dexie: DexieService,
    private directoryService: DirectoryService,
    private itemService: ItemService,
    private events: Events,
    private fileSystemService: FileSystemService,
    private backUpDBService: BackupDBService
  ) {
    this.table = this.dexie.table('profile');
  }

    async getProfileById(id: number): Promise<UserProfile> {
        return await this.table.get(id);
    }

  /**crypto-js
   * Saves a new profile and attaches a new directory and diary with the same id
   * @param profile object form
   * @returns {Promise<number>}
   */
  async save(profile: any) {
    const salt = MD5(Math.random().toString()).toString();
    let newProfile = {
      directory: null,
      name: profile.name,
      password:  SHA256(salt + profile.password).toString(),
      salt: salt
    };
    const profileId = await this.table.put(newProfile);
    const directoryId = await this.fileSystemService.createNewDirectory(profileId);
    newProfile = await this.table.get(profileId);
    newProfile.directory = directoryId;
    return await this.table.put(newProfile);
  }

    /**
     * Retrieve first profile in the database
     * @returns {Promise<R>}
     */
    getFirstProfile(): Promise<UserProfile> {
        return this.table.toArray(profile => {
          this.events.publish('profile:update', profile[0]);
            return profile[0];
        });
    }


    async getFirstProfileId() {
        const array = await this.table.toArray();
        return array[0].id;
    }

    /**
     * Edits an existing profile
     * @param name of user profile
     * @param gender of user profile
     * @param dob date of birth
     * @returns {Promise<void>}
     */
    async editProfile(name: string, gender: string, dob: string) {
        const profile = await this.getFirstProfile();
        profile.name = name;
        profile.gender = gender;
        profile.dob = dob;
        await this.table.put(profile);
    }

    clearDb() {
        this.dexie.table('profile').clear();
    }

  /**
   * Get all items which are part of the diary page
   * @param {number} profileId
   */
  getProfileDiaryItems(profileId: number): Promise<Item[]> {
    return this.itemService.getDiaryItemsByProfileID(profileId);
  }

  async exportProfile(profile_id: number) {
    const profile = await this.getFirstProfile();
    this.backUpDBService.exportProfile(profile_id, profile.password);
  }
}

