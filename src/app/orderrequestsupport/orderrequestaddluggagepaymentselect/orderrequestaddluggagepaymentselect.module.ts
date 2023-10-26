import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderRequestAddluggagePaymentSelectPage } from './orderrequestaddluggagepaymentselect.page';

const routes: Routes = [
  {
    path: '',
    component: OrderRequestAddluggagePaymentSelectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderRequestAddluggagePaymentSelectPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class OrderRequestAddluggagePaymentSelectPageModule {}
