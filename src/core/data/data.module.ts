import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
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
      ],
      ngModule: DataModule
    };
  }
}
