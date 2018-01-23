import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';

import Dexie from 'dexie';
import {BloodType} from '../../enum/blood-type.enum';
import {ProfileService} from '../profile/profile.service';

export interface MedicalInfo{
    id?: number;
    blood_type: BloodType;
    known_conditions: string[];
    allergies: string[];
}

@Injectable()
export class MedicalInfoService {

    table: Dexie.Table<MedicalInfo, number>;

    constructor(private dexie: DexieService, private profile: ProfileService) {

        this.table = this.dexie.table('medical-info');
    }

    async getMedicalInfo(): Promise<MedicalInfo> {
        return await this.table.get(await this.profile.getFirstProfileId());
    }

    async save(medical_info: MedicalInfo) {
        this.table.put(medical_info);
    }

    clearDb() {
        this.dexie.table('profile').clear();
    }
}
