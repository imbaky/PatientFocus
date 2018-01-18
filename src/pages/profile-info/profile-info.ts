import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from "../../core/data/services/profile/profile.service";


@Component({
    selector: 'page-profile-info',
    templateUrl: 'profile-info.html'
})
export class ProfileInfoPage {

    profile;

    constructor(profileService: ProfileService) {
        profileService.getFirstProfile().then(profile => {
            this.profile = profile;
        })
    }

}
