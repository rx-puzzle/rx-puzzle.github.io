import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/material.module';
import { RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage.component';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule],
  declarations: [HomepageComponent],
  exports: [CommonModule, RouterModule, MaterialModule, HomepageComponent],
})
export class HomepageModule {}
