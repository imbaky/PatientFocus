import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { PortfolioPage } from './pages/portfolio/portfolio';
import { ImportDocumentPage } from './pages/import-document/import-document';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(PortfolioPage),
    IonicModule.forRoot(ImportDocumentPage),
  ],
  declarations: [
    PortfolioPage,
    ImportDocumentPage
  ],
  exports: [
    PortfolioPage,
    ImportDocumentPage
  ],
  providers: [
    FileChooser,
    FilePath,
    File
  ]
})
export class PortfolioModule { }
