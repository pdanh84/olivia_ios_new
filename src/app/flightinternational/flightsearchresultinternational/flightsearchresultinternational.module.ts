import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FlightSearchResultInternationalPage } from './flightsearchresultinternational.page';

@NgModule({
  declarations: [
    FlightSearchResultInternationalPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FlightSearchResultInternationalPage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightSearchResultInternationalPageModule {}
