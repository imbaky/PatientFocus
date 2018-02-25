import { ItemService } from '@services/item/item.service';
import { FileSystemService } from '@services/file-system/file-system.service';
import { DirectoryService } from '@services/directory/directory.service';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { ProfileService, UserProfile } from '@services/profile/profile.service';
import { EmergencyContactService } from '@services/emergency-contact/emergency-contact.service';
import { EditInfoModal } from '@pages/profile-info/edit-info/edit-info';
import {MedicalInfoService} from '@services/medical-info/medical-info.service';
import {EmergencyContact} from '@interfaces/emergency-contact/emergency-contact';
import {MedicalInfo} from '@interfaces/medical-info/medical-info';


@Component({
    selector: 'page-profile-info',
    templateUrl: 'profile-info.html'
})
export class ProfileInfoPage {

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
                private itemService: ItemService,
                private ref: ChangeDetectorRef,
                private toastCtrl: ToastController) {

        this.profileService.getCurrentProfile().then(profile => {
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
                    if (img) {
                        this.profileImg = img.file.path;
                        this.profileService.cacheProfileImg(img.file.path);
                    }
                });
            });
        });
    }

    async editEmergencyContact() {
        const modal = this.modalCtrl.create(EditInfoModal,
            {profileId: this.profile.id,
                infoForm: 'emergency_contact',
                infoObject: this.emergencyContact});
        await modal.present();
        modal.onDidDismiss(() => {
            this.profileService.getCurrentProfile().then(profile => {
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
        modal.onDidDismiss(() => this.profileService.getCurrentProfile().then(profile => this.profile = profile));
    }

    async selectFile() {
        const uri = await this.fileChooser.open();
        window.resolveLocalFileSystemURL(uri, (fileEntry) => {
           fileEntry.getMetadata(async(metadata) => {
               const imgSrc = await this.filePath.resolveNativePath(uri);
               if (!this.profileImg) {
                   await this.itemService.getProfileImage(this.directory.id);
                   const image = await this.fileSystemService.addNewFileToDirectory(imgSrc, '', 'profile_image', this.directory, {profile_img: true});
                   this.profileImg = image.file.path;
                   this.profileService.cacheProfileImg(this.profileImg);
                   this.ref.detectChanges();
               } else {
                   const image = await this.itemService.getProfileImage(this.directory.id);
                   image.file.path = imgSrc;
                   await this.itemService.addItemToDB(image);
                   this.profileImg = imgSrc;
                   this.profileService.cacheProfileImg(imgSrc);
                   this.ref.detectChanges();
               }
           });
        });
    }

   async exportProfile() {
     const importToast = this.toastCtrl.create({
       message: `Profile exported to Downloads folder as patient-focus-profile.zip`,
       duration: 6000,
       position: 'bottom'
     });
     await importToast.present();
     this.profileService.exportProfile(this.profile.id);
   }

}
