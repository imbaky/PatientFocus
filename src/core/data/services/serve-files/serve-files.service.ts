import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';
import { UUID } from 'angular2-uuid';

import {ProfileService, UserProfile} from '@services/profile/profile.service';
import {MedicalInfoService, MedicalInfo} from '@services/medical-info/medical-info.service';


@Injectable()
export class ServeFilesService {

    webextension: string;
    userProfile: UserProfile
    medicalInfo: MedicalInfo
    password: string


    constructor(
        private dexie: DexieService,
        private profile: ProfileService,
        private medical: MedicalInfoService
    ) {
        this.webextension = UUID.UUID();
    }
}
