import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideComponent } from './guide.component';
import { MaterialModule } from 'app/material.module';
import { SandboxModule } from 'app/sandbox/sandbox.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: GuideComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    SandboxModule,
  ],
  declarations: [GuideComponent],
  exports: [CommonModule, MaterialModule, SandboxModule, GuideComponent],
})
export class GuideModule {}
