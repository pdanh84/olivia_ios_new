import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CombodoneprepayPage } from './combodoneprepay.page';

const routes: Routes = [
  {
    path: '',
    component: CombodoneprepayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CombodoneprepayPage]
})
export class CombodoneprepayPageModule {}
