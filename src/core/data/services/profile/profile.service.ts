import { MD5 , SHA256} from 'crypto-js';
import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { DirectoryService } from '../directory/directory.service';
import { Observable } from 'rxjs/Observable';
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
  current_profile: boolean;
  user_img: string;
}

@Injectable()
export class ProfileService {
  table: Dexie.Table<UserProfile, number>;
  profileObserver: any;
  profile: any;
  profileImgObserver: any;
  profileImg: any;

  constructor(
    private dexie: DexieService,
    private directoryService: DirectoryService,
    private itemService: ItemService,
    private events: Events,
    private fileSystemService: FileSystemService,
    private backUpDBService: BackupDBService
  ) {
    this.table = this.dexie.table('profile');

    this.profileObserver = null;
    this.profileImgObserver = null;

    this.profile = Observable.create(observer => {
      this.profileObserver = observer;
    });
    this.profileImg = Observable.create(observer => {
      this.profileImgObserver = observer;
    });
  }

  /**
   * Notifies app component that profile img has changed
   * @param path of img
   */
  async cacheProfileImg(path) {
    const currentProfile = await this.getCurrentProfile();
    currentProfile.user_img = path;
    await this.table.put(currentProfile);
    this.profileImgObserver.next(path);
  }

  /**
   * Retrieve a profile by id
   * @param id
   * @returns {Promise<undefined|UserProfile>}
   */
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
      salt: salt,
      current_profile: true,
      user_img: ''
    };
    const profileId = await this.table.put(newProfile);
    const directoryId = await this.fileSystemService.createNewDirectory(profileId);
    newProfile = await this.table.get(profileId);
    newProfile.directory = directoryId;
    return await this.table.put(newProfile);
  }

  /**
   * Retrieve the current profile in the database
   * @returns {Promise<R>}
   */
  async getCurrentProfile(): Promise<UserProfile> {
    const profiles = await this.table.toArray();
    for (const profile of profiles) {
      if (profile.current_profile) {
        this.events.publish('profile:update', profile);
        return profile;
      }
    }
    return null;
  }
   /**
   * sets the current profile by id
   */
  async setCurrentProfile(id: number) {
    const newProfile = await this.table.get(id);
    const currentProfile = await this.getCurrentProfile();
    if (newProfile) {
      currentProfile.current_profile = false;
      newProfile.current_profile = true;
      this.profileImgObserver.next(newProfile.user_img);
      await this.table.put(currentProfile);
      await this.table.put(newProfile);
    }
  }

  /**
   * Retrieves the current profile id
   * @returns {Promise<any>}
   */
  async getCurrentProfileId() {
    const profile = await this.getCurrentProfile();
    if (profile) {
      return profile.id;
    }
    return null;
  }

  /**
   * Retrieves an array of all available profiles
   * @returns {Promise<any>}
   */
  async getAllProfiles() {
    return await this.table.toArray();
  }

  /**
   * Edits an existing profile and notifies the app component of changes
   * @param name of user profile
   * @param gender of user profile
   * @param dob date of birth
   * @returns {Promise<void>}
   */
  async editProfile(name: string, gender: string, dob: string) {
    const profile = await this.getCurrentProfile();
    profile.name = name;
    profile.gender = gender;
    profile.dob = dob;
    this.profileObserver.next(name);
    await this.table.put(profile);
  }

  /**
   * Get all items which are part of the diary page
   * @param {number} profileId
   */
  getProfileDiaryItems(profileId: number): Promise<Item[]> {
    return this.itemService.getDiaryItemsByProfileID(profileId);
  }

  async exportProfile(profile_id: number) {
    const profile = await this.getCurrentProfile();
    this.backUpDBService.exportProfile(profile_id, profile.password);
  }

  async importProfile(zipUrl: string) {
    await this.backUpDBService.importProfile(zipUrl);
  }
}

