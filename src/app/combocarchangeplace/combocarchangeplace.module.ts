import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CombocarchangeplacePage } from './combocarchangeplace.page';

const routes: Routes = [
  {
    path: '',
    component: CombocarchangeplacePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CombocarchangeplacePage]
})
export class CombocarchangeplacePageModule {}
