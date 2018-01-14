import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

import { FilterFileName } from '../../pipes/filterfilespace';
import { FileFilterByDate, FileFilterByName, FileFilterByDocType, FileFilterByFormatType } from '../../pipes/file-filter/file-filter.pipe';
import { PortfolioPage } from '../portfolio/portfolio';
import { ImportDocumentPage } from '../portfolio/import-document/import-document';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera } from '@ionic-native/camera';
import { EmailDocumentsPage } from '../../pages/portfolio/email-documents/email-documents';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(PortfolioPage),
    IonicModule.forRoot(ImportDocumentPage),
    IonicModule.forRoot(EmailDocumentsPage),
  ],
  declarations: [
    PortfolioPage,
    ImportDocumentPage,
    FilterFileName,
    EmailDocumentsPage,
    FileFilterByDate,
    FileFilterByName,
    FileFilterByDocType,
    FileFilterByFormatType
  ],
  exports: [
    PortfolioPage,
    EmailDocumentsPage,
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
