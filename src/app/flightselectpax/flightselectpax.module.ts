import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FlightselectpaxPage } from './flightselectpax.page';

@NgModule({
  declarations: [
    FlightselectpaxPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: FlightselectpaxPage
    }]),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightselectpaxPageModule {}
