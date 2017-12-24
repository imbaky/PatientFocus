import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';

export interface Profile {
    id?: number;
    directory: number;
    password: string;
    loaded: boolean;
}

@Injectable()
export class ProfileService {

    table: Dexie.Table<File, number>;

    constructor(private dexie: DexieService) {
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
        this.table.put({
            id: 1,
            name: profile.name,
            password: profile.password,
            loaded: true
        });
        console.log('added');
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
