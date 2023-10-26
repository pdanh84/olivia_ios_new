import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketpaymentbankPage } from './ticketpaymentbank.page';

const routes: Routes = [
  {
    path: '',
    component: TicketpaymentbankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketpaymentbankPage]
})
export class TicketpaymentbankPageModule {}
