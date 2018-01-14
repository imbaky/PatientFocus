import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { DirectoryService } from './services/directory/directory.service';
import { DiaryService } from './services/diary/diary.service';
import { DiaryEntryService } from './services/diary-entry/diary-entry.service';
import { FileService } from './services/file/file.service';
import { ItemService } from './services/item/item.service';
import { ProfileService } from './services/profile/profile.service';
import { DexieService } from './services/dexie/dexie.service';
import { FileSystemService } from './services/file-system/file-system.service';

@NgModule({
    imports: [
        CommonModule
    ]
})
export class DataModule {
    constructor(@Optional() @SkipSelf() parent: DataModule) {
        if (parent) {
            throw new Error(DataModule.name + ' was already loaded!');
        }
    }

    static forRoot(): ModuleWithProviders {
        return {
            providers: [
                DexieService,
                DirectoryService,
                DiaryService,
                DiaryEntryService,
                ItemService,
                ProfileService,
                FileService,
                FileSystemService
            ],
            ngModule: DataModule
        };
    }
  }
