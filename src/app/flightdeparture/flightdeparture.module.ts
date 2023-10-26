import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlightDeparturePage } from './flightdeparture';

@NgModule({
  declarations: [
    FlightDeparturePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FlightDeparturePage
      }
    ])
  ],
})
export class FlightDeparturePageModule {}
