import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarbleComponent } from './marble.component';
import { MarblePaletteComponent } from './marble-palette.component';
import { MarbleSequenceComponent } from './marble-sequence.component';
import { DropDirective } from './drop.directive';
import { MaterialModule } from 'app/material.module';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    MarbleComponent,
    MarblePaletteComponent,
    MarbleSequenceComponent,
    DropDirective,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    MarbleComponent,
    MarblePaletteComponent,
    MarbleSequenceComponent,
    DropDirective,
  ],
})
export class MarbleModule {}
