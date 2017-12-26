import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';

export interface UserProfile {
    id?: number;
    directory: number;
    name: string;
    password: string;
}

@Injectable()
export class ProfileService {

    table: Dexie.Table<UserProfile, number>;

    constructor(private dexie: DexieService) {

        this.table = this.dexie.table('profile');
    }

    async getProfileById(id: number): Promise<UserProfile> {
        const userProfile = this.table.get(id);
        userProfile.then(profile => {
            console.log(profile);
        });
        return userProfile;
    }

    save(profile: UserProfile) {
        console.log(profile);
        const entry = {
            name: profile.name,
            password: profile.password,
        };
        this.table.add(entry);
    }

    async getFirstProfile(): Promise<UserProfile> {
        return this.table.toArray(profile => {
                console.log(profile);
                return profile[0];
        });
    }

    clearDb() {
        this.table.clear();
    }
}

