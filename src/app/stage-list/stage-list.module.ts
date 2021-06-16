import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageListComponent } from './stage-list.component';
import { MaterialModule } from 'app/material.module';
import { SandboxModule } from 'app/sandbox/sandbox.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StageListComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule,
    SandboxModule,
  ],
  declarations: [StageListComponent],
  exports: [CommonModule, MaterialModule, SandboxModule, StageListComponent],
})
export class StageListModule {}
