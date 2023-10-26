import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketPaymentSelectPage } from './ticketpaymentselect.page';

const routes: Routes = [
  {
    path: '',
    component: TicketPaymentSelectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketPaymentSelectPage]
})
export class TicketPaymentSelectPageModule {}
