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
      const uri = await this.fileChooser.open();
      window.resolveLocalFileSystemURL(uri, fileEntry => {
        fileEntry.getMetadata(async metadata => {
          let fullPath = await this.filePath.resolveNativePath(uri);
          //this.profileService.importProfile(fullPath);
        });
      });
      let password = this.enterImportedPassword();
      console.log(password);
    }

    async enterImportedPassword(){
      let password;
      let alert = this.alertController.create({
        title: 'Enter Password',
        message: "Enter the Profile's Password",
        inputs: [{
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Enter',
            handler: data => {
              password = data.password;
            }
          }
        ]
      });
      await alert.present();
      return password;
    }
}
