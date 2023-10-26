import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PopupinfobkgPage } from './popupinfobkg.page';

const routes: Routes = [
  {
    path: '',
    component: PopupinfobkgPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PopupinfobkgPage]
})
export class PopupinfobkgPageModule {}
