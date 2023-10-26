import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeTicketSearchPage } from './hometicketsearch.page';

@NgModule({
  declarations: [
    HomeTicketSearchPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [HomeTicketSearchPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HomeTicketSearchPageModule {}
