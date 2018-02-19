import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import {BloodType} from '@enum/blood-type.enum';
import {ProfileService} from '@services/profile/profile.service';

export interface MedicalInfo {
    id: number;
    blood_type: BloodType;
    known_conditions: string;
    allergies: string;
    profile_id: number;
}

export interface BloodTypeOption {
    name: string;
    value: BloodType;
}

@Injectable()
export class MedicalInfoService {

    table: Dexie.Table<MedicalInfo, number>;

    constructor(private dexie: DexieService, private profile: ProfileService) {
        this.table = this.dexie.table('medical_info');
    }

    async getMedicalInfo(): Promise<MedicalInfo> {
        return await this.table.get(await this.profile.getFirstProfileId());
    }

    async save(medical_info: MedicalInfo) {
      const prof = await this.profile.getFirstProfileId();
      medical_info.id = prof;
      await this.table.put(medical_info);
    }

    clearDb() {
        this.dexie.table('profile').clear();
    }
}
