import { Injectable } from '@angular/core';
import { DexieService } from '../dexie/dexie.service';
import { UUID } from 'angular2-uuid';

import {ProfileService, UserProfile} from '@services/profile/profile.service';
import {MedicalInfoService, MedicalInfo} from '@services/medical-info/medical-info.service';
import { Broadcaster } from '@ionic-native/broadcaster';
import {Httpd,HttpdOptions} from '@ionic-native/httpd';

@Injectable()
export class ServeFilesService {

    webextension: string;
    userProfile: UserProfile
    medicalInfo: MedicalInfo
    password: string


    constructor(
        private dexie: DexieService,
        private broadcaster: Broadcaster,
        private httpd: Httpd,
        private profile: ProfileService,
        private medical: MedicalInfoService
    ) {
        this.broadcaster.addEventListener('shareFiles')
            .subscribe((event) => {
                console.log(event);
                this.webextension = UUID.UUID();
                const options: HttpdOptions = {
                    www_root: 'sharefolder',
                    port: 8080,
                    localhost_only: false
                };

                this.httpd.startServer(options).subscribe((data) => {
                    document.getElementById('url').innerHTML = 'server is started: <a href=' + data + '>' + data + '</a>';
                });

            });
    }
}
