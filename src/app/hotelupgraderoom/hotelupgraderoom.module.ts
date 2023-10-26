import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HotelupgraderoomPage } from './hotelupgraderoom.page';

const routes: Routes = [
  {
    path: '',
    component: HotelupgraderoomPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HotelupgraderoomPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HotelupgraderoomPageModule {}
