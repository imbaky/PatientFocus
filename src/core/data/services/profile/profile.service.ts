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
        return this.table.get(id);

    }

    save(profile: any) {
        const entry = {
            directory: null,
            name: profile.name,
            password: profile.password,
        };
       return this.table.put(entry);
    }

    async getFirstProfile(): Promise<UserProfile> {
        return this.table.toArray(profile => {
                return profile[0];
        });
    }

    clearDb() {
        this.table.clear();
    }
}

