import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HotellistmoodfilterPage } from './hotellistmoodfilter.page';

const routes: Routes = [
  {
    path: '',
    component: HotellistmoodfilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HotellistmoodfilterPage]
})
export class HotellistmoodfilterPageModule {}
