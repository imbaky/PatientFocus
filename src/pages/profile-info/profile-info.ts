import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { ProfileService, UserProfile } from '@services/profile/profile.service';
import { Httpd, HttpdOptions } from '@ionic-native/httpd';

import {
    EmergencyContactService,
    EmergencyContact
} from '@services/emergency-contact/emergency-contact.service';
import { EditInfoModal } from '@pages/profile-info/edit-info/edit-info';
import {MedicalInfo, MedicalInfoService} from '@services/medical-info/medical-info.service';


@Component({
    selector: 'page-profile-info',
    templateUrl: 'profile-info.html'
})
export class ProfileInfoPage {

    profile: UserProfile;
    emergencyContact: EmergencyContact;
    medicalInfo: MedicalInfo;


    constructor(public navCtrl: NavController,
                private profileService: ProfileService,
                private medicalInfoService: MedicalInfoService,
                private emergencyContactService: EmergencyContactService,
                private modalCtrl: ModalController,
                private httpd: Httpd) {

        this.profileService.getFirstProfile().then(profile => {
            this.profile = profile;
            emergencyContactService.getEmergencyContact(profile.emergency_contact_id).then(contact => {
                this.emergencyContact = contact;
            });
            this.medicalInfoService.getMedicalInfo().then( medicalInfo => {
                this.medicalInfo = medicalInfo;
             });
        });
    }

    async editEmergencyContact() {
        const modal = this.modalCtrl.create(EditInfoModal,
            {profileId: this.profile.id,
                infoForm: 'emergency_contact',
                infoObject: this.emergencyContact});
        await modal.present();
        modal.onDidDismiss(() => { // todo not sure how to async await this
            this.profileService.getFirstProfile().then(profile => {
                this.emergencyContactService.getEmergencyContact(profile.emergency_contact_id).then(c => {
                    this.emergencyContact = c;
                });
            });
        });
    }

    async editMedicalInfo() {
        const modal = this.modalCtrl.create(EditInfoModal,
            {profileId: this.profile.id,
                infoForm: 'medical_info',
                infoObject: this.medicalInfo});
        await modal.present();
        modal.onDidDismiss(() => this.medicalInfoService.getMedicalInfo().then( medicalInfo => {
            this.medicalInfo = medicalInfo;
        }));
    }

    async editProfile() {
        const modal = this.modalCtrl.create(EditInfoModal, {profileId: this.profile.id, infoForm: 'profile', infoObject: this.profile});
        await modal.present();
        modal.onDidDismiss(() => this.profileService.getFirstProfile().then(profile => this.profile = profile));
    }

    submit() {
    }

    startServer() {
        const options: HttpdOptions = {
          www_root: 'sharefolder',
          port: 8080,
          localhost_only: false
        };
        this.httpd.startServer(options).subscribe((data) => {
          document.getElementById('url').innerHTML = 'server is started: <a href=' + data + '>' + data + '</a>';
        });
    }
}
