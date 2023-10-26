import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlightComboAddDetailsPage } from './flightcomboadddetails';

@NgModule({
  declarations: [
    FlightComboAddDetailsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: FlightComboAddDetailsPage
      }
    ])
  ],
})
export class FlightComboAddDetailsPageModule {}
