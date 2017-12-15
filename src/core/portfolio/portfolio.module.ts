import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { PortfolioPage } from './portfolio';
import { AddDocumentModal } from './modals/add-document/add-document';

import { PortfolioService} from "./portfolio.service";

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(PortfolioPage),
    IonicModule.forRoot(AddDocumentModal),
  ],
  declarations: [
    PortfolioPage,
    AddDocumentModal
  ],
  exports: [
    PortfolioPage,
    AddDocumentModal
  ],
  providers: [
    FileChooser,
    FilePath,
    PortfolioService
  ]
})
export class PortfolioModule { }
