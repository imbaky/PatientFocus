import { Component, ChangeDetectorRef } from '@angular/core';

import { ModalController } from 'ionic-angular';
import { ProfileService, UserProfile } from '../../core/data/services/profile/profile.service';
import {
    EmergencyContactService,
    EmergencyContact
} from '../../core/data/services/emergency-contact/emergency-contact.service';
import { EditInfoModal } from '../../pages/profile-info/edit-info/edit-info';
import {MedicalInfo, MedicalInfoService} from '../../core/data/services/medical-info/medical-info.service';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from "@ionic-native/file-path";
import { DirectoryService } from "../../core/data/services/directory/directory.service";
import { FileSystemService } from "../../core/data/services/file-system/file-system.service";
import { ItemService } from "../../core/data/services/item/item.service";


@Component({
    selector: 'page-profile-info',
    templateUrl: 'profile-info.html'
})
export class ProfileInfoPage{

    profile: UserProfile;
    emergencyContact: EmergencyContact;
    medicalInfo: MedicalInfo;
    profileImg: String;
    directory: any;


    constructor(private profileService: ProfileService,
                private medicalInfoService: MedicalInfoService,
                private emergencyContactService: EmergencyContactService,
                private modalCtrl: ModalController,
                private fileChooser: FileChooser,
                private filePath: FilePath,
                private directoryService: DirectoryService,
                private fileSystemService: FileSystemService,
                private itemService: ItemService, private ref:ChangeDetectorRef) {

        this.profileService.getFirstProfile().then(profile => {
            this.profile = profile;
            emergencyContactService.getEmergencyContact(profile.emergency_contact_id).then(contact => {
                this.emergencyContact = contact;
            });
            this.medicalInfoService.getMedicalInfo().then( medicalInfo => {
                this.medicalInfo = medicalInfo;
             });
            this.directoryService.getDirectoryById(this.profile.id).then(directory => {
                this.directory = directory;
                this.itemService.getProfileImage(directory.id).then(img => {
                    if (img)
                        this.profileImg = img.file.path;
                })
            })
        });
    }

    async editEmergencyContact() {
        const modal = this.modalCtrl.create(EditInfoModal,
            {profileId: this.profile.id,
                infoForm: 'emergency_contact',
                infoObject: this.emergencyContact});
        await modal.present();
        modal.onDidDismiss(() => {
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

    async selectFile() {
        const uri = await this.fileChooser.open();
        window.resolveLocalFileSystemURL(uri, (fileEntry) => {
           fileEntry.getMetadata(async(metadata) => {
               let imgSrc = await this.filePath.resolveNativePath(uri);
               console.log(imgSrc);
               if(!this.profileImg) {
                   let image = await this.fileSystemService.addNewFileToDirectory(imgSrc, '', 'profile_image', this.directory, {profile_img: true});
                   this.profileImg = image.file.path;
                   this.ref.detectChanges();
               } else {
                   let image = await this.itemService.getProfileImage(this.directory.id);
                   image.file.path = imgSrc;
                   await this.itemService.addItemToDB(image);
                   this.profileImg = imgSrc;
                   this.ref.detectChanges();
               }
           });
        });
    }

}
