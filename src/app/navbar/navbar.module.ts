import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NavbarComponent } from './navbar.component';
import { MaterialModule } from 'app/material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule],
  declarations: [NavbarComponent],
  exports: [CommonModule, RouterModule, MaterialModule, NavbarComponent],
})
export class NavbarModule {}
