import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { DirectoryService } from "../directory/directory.service";
import { DocumentType, FileFormatType } from "../../enum/file-type.enum";
import { ItemType } from "../../enum/item-type.enum";

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

    async save(profile: any) {
        const entry = {
            directory: null,
            name: profile.name,
            password: profile.password,
        };
        let profileId = await this.table.put(entry);
        const directoryid = await this.directoryService.createNewDirectory(profileId);
        const profile2 = await this.table.get(profileId);
        profile2.directory = directoryid;
        profileId = await this.table.put(profile2);

        const date = new Date();

        this.dexie.table('item').bulkAdd([
            {
                name: 'Filename1.txt',
                description: 'lab test1',
                type: ItemType.FILE,
                type_id: 1,
                directory_id: directoryid,
                chosen_date: date.toISOString()
            },
            {
                name: 'Filename2.txt',
                description: 'lab test2',
                type: ItemType.FILE,
                type_id: 2,
                directory_id: directoryid,
                chosen_date: date.toISOString()
            },
            {
                name: 'Filename2.txt',
                description: 'blood test',
                type: ItemType.FILE,
                type_id: 3,
                directory_id: directoryid,
                chosen_date: date.toISOString()
            },
        ]);
        return profileId;
    }

    async getFirstProfile(): Promise<UserProfile> {
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

