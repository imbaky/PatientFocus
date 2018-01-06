import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { PortfolioPage } from '../pages/portfolio/portfolio';
import { ImportDocumentPage } from '../pages/portfolio/import-document/import-document';
import { FilterFileName } from '../pipes/filterfilespace';
import { FileFilter } from '../pipes/file-filter/file-filter.pipe';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera, CameraOptions } from '@ionic-native/camera';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(PortfolioPage),
    IonicModule.forRoot(ImportDocumentPage),
  ],
  declarations: [
    PortfolioPage,
    ImportDocumentPage,
    FilterFileName,
    FileFilter
  ],
  exports: [
    PortfolioPage,
    ImportDocumentPage
  ],
  providers: [
    FileChooser,
    FilePath,
    FileOpener,
    PhotoViewer,
    File,
    Camera
  ]
})
export class PortfolioModule { }
