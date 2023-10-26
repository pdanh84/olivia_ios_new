import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketPaymentDonePage } from './ticketpaymentdone.page';

const routes: Routes = [
  {
    path: '',
    component: TicketPaymentDonePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketPaymentDonePage]
})
export class TicketPaymentDonePageModule {}
