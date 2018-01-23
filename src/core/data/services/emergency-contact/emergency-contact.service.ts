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

    /**
     * Gets a emergency contact
     * @param id of emergency contact
     * @returns {Promise<undefined|EmergencyContact>}
     */
    async getEmergencyContact(id) {
        if (id) {
            return await this.table.get(id);
        }
        return undefined;
    }

    /**
     * Associates an emergency contact with a profile through profileId if emergency contact does not yet exist
     * @param profileId
     * @param name of emergency contact
     * @param relationship to the patient
     * @param phoneNumber of the emergency contact
     * @returns {Promise<void>}
     */
    async setEmergencyContact(profileId, name: string, relationship: string, phoneNumber: number) {
        const profile = await this.profileService.getProfileById(profileId);

        const emergencyContact = await this.table.get(profile.id);

        // Contact already exists
        if (emergencyContact) {
            emergencyContact.name = name;
            emergencyContact.relationship = relationship;
            emergencyContact.phoneNumber = phoneNumber;
            await this.table.put(emergencyContact);
        } else {
            const contactId = await this.table.put({
                name: name,
                relationship: relationship,
                phoneNumber: phoneNumber,
            });

            profile.emergency_contact_id = contactId;
            this.dexie.table('profile').put(profile);
        }
    }



}

