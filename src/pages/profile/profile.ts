import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '@services/profile/profile.service';
import { DashboardPage } from '@pages/dashboard/dashboard';
import { ProfileInfoPage } from '@pages/profile-info/profile-info';
import { TourPage } from '@pages/tour/tour';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { AlertController } from 'ionic-angular';
import { PasswordPromptPage } from '@pages/password-prompt/password-prompt';


declare var window;

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {
    private createProfile: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private profileService: ProfileService,
                private navCtrl: NavController,
                private fileChooser: FileChooser,
                private filePath: FilePath,
                private alertController: AlertController) {
        this.createProfile = this.formBuilder.group({
            name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    async makeNewProfile() {
        const profile = await this.profileService.save(this.createProfile.value);
        if (profile) {
            this.navCtrl.setRoot(TourPage);
        }
    }

    async importProfile() {
      try {
        const uri = await this.fileChooser.open();
        const fullPath = await this.filePath.resolveNativePath(uri);
        await this.profileService.importProfile(fullPath);
        await this.successfulImport();
        this.navCtrl.setRoot(PasswordPromptPage);
      } catch (e) {
        console.log(e);
        this.errorImportingProfile();
      }
    }

  async errorImportingProfile() {
    const alert = this.alertController.create({
      title: 'Invalid Profile',
      message: 'Unable to Import Profile',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

  async successfulImport() {
    const alert = this.alertController.create({
      title: 'Success!',
      message: 'Imported Profile Successfully',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }
}
