import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { DirectoryService } from '../directory/directory.service';

export interface UserProfile {
    id?: number;
    directory: number;
    name: string;
    password: string;
}

@Injectable()
export class ProfileService {

    table: Dexie.Table<UserProfile, number>;

    constructor(private dexie: DexieService, private directoryService: DirectoryService) {

        this.table = this.dexie.table('profile');
    }

    async getProfileById(id: number): Promise<UserProfile> {
        return this.table.get(id);

    }

    /**
     * Saves a new profile and attaches a new directory with the same id
     * @param profile object form
     * @returns {Promise<number>}
     */
    async save(profile: any) {
        let entry = {
            directory: null,
            name: profile.name,
            password: profile.password,
        };
        let profileId = await this.table.put(entry);
        const directoryId = await this.directoryService.createNewDirectory(profileId);
        entry = await this.table.get(profileId);
        entry.directory = directoryId;
        profileId = await this.table.put(entry);

        return profileId;
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

