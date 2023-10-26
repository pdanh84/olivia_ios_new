import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeTicketPage } from './hometicket.page';
import { HomeTicketSearchPageModule } from '../hometicketsearch/hometicketsearch.module';
import { HomeTicketSlidePageModule } from '../hometicketslide/hometicketslide.module';

@NgModule({
  declarations: [
    HomeTicketPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTicketSearchPageModule,
    HomeTicketSlidePageModule
  ],
  exports: [HomeTicketPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeTicketPageModule {}
