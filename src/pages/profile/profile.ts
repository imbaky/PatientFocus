import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/data/services/profile/profile.service';
import { Welcome } from "../welcome/welcome";


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class Profile {
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
        let profile = await this.profileService.save(this.createProfile.value);
        if (profile) {
            this.navCtrl.setRoot(Welcome);
        }
    }
}