import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PickupCalendarPage } from './pickup-calendar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    PickupCalendarPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: PickupCalendarPage
    }]),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PickupCalendarPageModule {}