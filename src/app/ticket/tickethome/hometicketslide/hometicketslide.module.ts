import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeTicketSlidePage } from './hometicketslide.page';

@NgModule({
  declarations: [
    HomeTicketSlidePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [HomeTicketSlidePage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeTicketSlidePageModule {}