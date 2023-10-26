import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FlightInternationalPaymentatOfficePage } from './flightinternationalpaymentatoffice.page';

@NgModule({
  declarations: [
    FlightInternationalPaymentatOfficePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FlightInternationalPaymentatOfficePage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightInternationalPaymentatOfficePageModule {}
