import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingPage } from './booking.page';
import { MytripHistoryPageModule} from '../../mytriphistory/mytriphistory.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MytripHistoryPageModule
  ],
  declarations: [BookingPage],
  //exports: [BookingPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class BookingPageModule {}
