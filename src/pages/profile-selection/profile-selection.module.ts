import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSelectionPage } from './profile-selection';

@NgModule({
  declarations: [
    ProfileSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSelectionPage),
  ],
})
export class ProfileSelectionPageModule {}