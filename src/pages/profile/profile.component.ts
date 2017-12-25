import { Component, OnInit } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../core/data/services/profile/profile.service';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class Profile {
    name: string;
    password: string;

    private createProfile: FormGroup;

    constructor(private formBuilder: FormBuilder, private profileService: ProfileService) {
        this.createProfile = this.formBuilder.group({
            name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    makeNewProfile() {
        this.profileService.save(this.createProfile.value);
    }

    getProfile() {
        this.profileService.getFirstProfile();
    }

    clear() {
        this.profileService.clearDb();
        console.log('cleared');
    }

}