import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordPromptPage } from './password-prompt';

@NgModule({
  declarations: [
    PasswordPromptPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordPromptPage),
  ],
})
export class PasswordPromptPageModule {}
