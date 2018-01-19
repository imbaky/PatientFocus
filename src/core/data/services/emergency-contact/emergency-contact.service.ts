import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import { ProfileService } from "../profile/profile.service";

export interface EmergencyContact {
    id?: number;
    name: string,
    relationship: string,
    phoneNumber: number;
}

@Injectable()
export class EmergencyContactService {

    table: Dexie.Table<EmergencyContact, number>;

    constructor(private dexie: DexieService, private profileService: ProfileService) {
        this.table = this.dexie.table('emergency_contact');
    }

    async getEmergencyContact(id) {
        return await this.table.get(id);
    }

    async setEmergencyContact(profileId, name: string, relationship: string, phoneNumber: number) {
        const profile = await this.profileService.getProfileById(profileId);

        const contactId = await this.table.put({
            name: name,
            relationship: relationship,
            phoneNumber: phoneNumber,
        });

        console.log(contactId);
        profile.emergency_contact_id = contactId;
        this.dexie.table('profile').put(profile);
    }

}

