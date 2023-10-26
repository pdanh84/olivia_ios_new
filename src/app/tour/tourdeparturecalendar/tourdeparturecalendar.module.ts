import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TourDepartureCalendarPage } from './tourdeparturecalendar.page';

@NgModule({
  declarations: [
    TourDepartureCalendarPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: TourDepartureCalendarPage
    }]),
  ],
})
export class TourDepartureCalendarPageModule {}