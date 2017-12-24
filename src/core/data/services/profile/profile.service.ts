import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import {Profile} from '../../../../pages/profile/profile';

export interface Profile {
    id?: number;
    name: string;
    password: string;
    loaded: boolean;
}

@Injectable()
export class ProfileService {

    table: Dexie.Table<Profile, number>;

    constructor(
        private dexie: DexieService
    ) {
        this.table = this.dexie.table('profile');
    }

    async getProfileById(id: number): Promise<Profile> {
        const userProfile = this.table.get(id);
        userProfile.then(profile => {
            console.log(profile);
            console.log('^^^^');
        });
        return userProfile;
        // return Promise.all(userProfile)
    }

    save(profile: Profile) {
        console.log(profile);
        const entry = {
            name: profile.name,
            password: profile.password,
        };
        this.table.put(entry);
        console.log('added');
    }

    async getFirstProfile(): Promise<Profile> {
        return this.table.toArray(profile => {
                console.log(profile);
                return profile[0];
        });
    }

    // async getProfile() {
    //     this.table.get('profile').then(profile => {
    //         console.log(profile);
    //     });
    //     return this.table.get(1);
    // }

    clearDb() {
        this.table.clear();
    }
}