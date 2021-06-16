import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarbleModule } from '../marble/marble.module';
import { SandboxItemComponent } from './sandbox-item.component';
import { SandboxComponent } from './sandbox.component';

import { MaterialModule } from 'app/material.module';

@NgModule({
  imports: [CommonModule, MaterialModule, MarbleModule],
  declarations: [SandboxItemComponent, SandboxComponent],
  exports: [
    CommonModule,
    MaterialModule,
    MarbleModule,
    SandboxItemComponent,
    SandboxComponent,
  ],
})
export class SandboxModule {}
