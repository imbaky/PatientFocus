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
import { LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';


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
                private alertController: AlertController,
                private loadingController: LoadingController,
                private file: File) {
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
      const helpOptions = this.createHelpOptions();
      let helpScreen = this.alertController.create(helpOptions);
      helpScreen.present();
    }

  async errorImportingProfile(errorTitle, errorMessage) {
    const alert = this.alertController.create({
      title: errorTitle,
      message: errorMessage,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
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

  createHelpOptions() {
      return  {
        title: 'Import Document',
        message: 'Select the location of the zip file patient-focus-profile.zip. If the application fails to load the profile ' +
        'from the Downloads directory, try placing the zip file in another directory.',
        inputs: [
          {
            name: 'downloadDir',
            label: 'Downloads',
            checked: true,
            type: 'radio',
            value: 'downloads'
          },
          {
            name: 'other',
            label: 'Other',
            checked: false,
            type: 'radio',
            value: 'other'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'OK',
            role: '',
            handler : (data) => {
              this.getUri(data); // by default import from downloads directory
            }
          },
        ]
      };
  }

  async getUri(directory){
    let loading = this.loadingController.create({
      content: 'Importing profile...'
    });
    let fullPath = '';
    if(directory == "downloads") { // import from downloads folder
      fullPath = this.file.externalRootDirectory + 'Download/patient-focus-profile.zip';
      try {
        loading.present();
        await this.profileService.importProfile(fullPath);
        loading.dismiss();
        await this.successfulImport();
        this.navCtrl.setRoot(PasswordPromptPage);
      } catch (e) {
        loading.dismiss();
        this.errorImportingProfile('Profile Does not Exist', 'File name patient-focus-profile.zip does not exist in your Download folder.');
      }
    }
    else { // import from file selector
      const uri = await this.fileChooser.open();
      loading.present();
      fullPath = await this.filePath.resolveNativePath(uri);
      try {
        await this.profileService.importProfile(fullPath);
        loading.dismiss();
        await this.successfulImport();
        this.navCtrl.setRoot(PasswordPromptPage);
      } catch (e) {
        loading.dismiss();
        this.errorImportingProfile('Invalid Profile', 'Unable to Import Profile');
      }
    }
  }
}
