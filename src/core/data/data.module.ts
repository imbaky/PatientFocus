import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { DirectoryService } from './services/directory/directory.service';
import { FileService } from './services/file/file.service';
import { ItemService } from './services/item/item.service';
import { ProfileService } from './services/profile/profile.service';
import { DexieService } from './services/dexie/dexie.service';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class DataModule {
  constructor (@Optional() @SkipSelf() parent: DataModule) {
    if (parent) {
      throw new Error(DataModule.name + ' was already loaded!');
    }
  }
  static forRoot(): ModuleWithProviders {
    return {
      providers: [
        DexieService,
        DirectoryService,
        ItemService,
        ProfileService,
        FileService
      ],
      ngModule: DataModule
    };
  }
}
