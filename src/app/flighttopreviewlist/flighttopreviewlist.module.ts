import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FlightTopReviewListPage } from './flighttopreviewlist.page';

const routes: Routes = [
  {
    path: '',
    component: FlightTopReviewListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlightTopReviewListPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class FlightTopReviewListPageModule {}