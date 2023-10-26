import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderRequestAddluggagePaymentBankPage } from './orderrequestaddluggagepaymentbank.page';

const routes: Routes = [
  {
    path: '',
    component: OrderRequestAddluggagePaymentBankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderRequestAddluggagePaymentBankPage]
})
export class OrderRequestAddluggagePaymentBankPageModule {}
