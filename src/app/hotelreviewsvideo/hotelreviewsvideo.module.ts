import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HotelreviewsvideoPage } from './hotelreviewsvideo';

@NgModule({
  declarations: [
    HotelreviewsvideoPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: HotelreviewsvideoPage
    }]),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HotelreviewsvideoPageModule {}
