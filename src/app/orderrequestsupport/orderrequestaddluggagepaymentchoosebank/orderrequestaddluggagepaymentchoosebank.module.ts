import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderRequestAddluggagePaymentChooseBankPage } from './orderrequestaddluggagepaymentchoosebank.page';

const routes: Routes = [
  {
    path: '',
    component: OrderRequestAddluggagePaymentChooseBankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrderRequestAddluggagePaymentChooseBankPage]
})
export class OrderRequestAddluggagePaymentChooseBankPageModule {}
