import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { ProfileService, UserProfile } from "../../core/data/services/profile/profile.service";
import {
    EmergencyContactService,
    EmergencyContact
} from "../../core/data/services/emergency-contact/emergency-contact.service";
import { EditInfoModal } from "../../modal/edit-info-modal";


@Component({
    selector: 'page-profile-info',
    templateUrl: 'profile-info.html'
})
export class ProfileInfoPage {

    profile: UserProfile;
    emergencyContact: EmergencyContact;


    constructor(private profileService: ProfileService,
                private emergencyContactService: EmergencyContactService,
                private modalCtrl: ModalController) {

        this.profileService.getFirstProfile().then(profile => {
            this.profile = profile;
            emergencyContactService.getEmergencyContact(profile.emergency_contact_id).then(contact => {
                this.emergencyContact = contact;
            });
        });
    }

    async editEmergencyContact() {
        let modal = this.modalCtrl.create(EditInfoModal, {profileId: this.profile.id, infoForm: 'emergency_contact'});
        await modal.present();
        modal.onDidDismiss(() => { // todo not sure how to async await this
            this.profileService.getFirstProfile().then(profile => {
                this.emergencyContactService.getEmergencyContact(profile.emergency_contact_id).then(c => {
                    this.emergencyContact = c;
                })
            });
        });
    }

    async editProfile() {
        let modal = this.modalCtrl.create(EditInfoModal, {profileId: this.profile.id, infoForm: 'profile'});
        await modal.present();
        modal.onDidDismiss(() => {

        })
    }

    submit() {
    }

}
