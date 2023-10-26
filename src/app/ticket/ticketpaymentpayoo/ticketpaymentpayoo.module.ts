import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketPaymentPayooPage } from './ticketpaymentpayoo.page';

const routes: Routes = [
  {
    path: '',
    component: TicketPaymentPayooPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketPaymentPayooPage]
})
export class TicketPaymentPayooPageModule {}
