import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService, UserProfile } from "../../core/data/services/profile/profile.service";
import {
    EmergencyContactService,
    EmergencyContact
} from "../../core/data/services/emergency-contact/emergency-contact.service";


@Component({
    selector: 'page-profile-info',
    templateUrl: 'profile-info.html'
})
export class ProfileInfoPage {

    profile: UserProfile;
    emergencyContact: EmergencyContact;

    constructor(profileService: ProfileService, emergencyContactService: EmergencyContactService) {
        // test code
        profileService.getFirstProfile().then(profile => {
            this.profile = profile;
            emergencyContactService.setEmergencyContact(profile.id, "bob", "friend", 911).then(() => {
                emergencyContactService.getEmergencyContact(profile.emergency_contact_id).then(c => {
                    this.emergencyContact = c;
                    console.log(this.emergencyContact);
                });
            })
        });
        // -- 
    }

}
