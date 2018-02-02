import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '@services/profile/profile.service';
import { WelcomePage } from '../welcome/welcome';
import { ProfileInfoPage } from '../profile-info/profile-info';


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {
    private createProfile: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private profileService: ProfileService,
                private navCtrl: NavController) {
        this.createProfile = this.formBuilder.group({
            name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    async makeNewProfile() {
        const profile = await this.profileService.save(this.createProfile.value);
        if (profile) {
            this.navCtrl.setRoot(ProfileInfoPage);
        }
    }
}
