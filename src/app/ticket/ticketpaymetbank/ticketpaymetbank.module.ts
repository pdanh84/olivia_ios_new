import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketpaymetbankPage } from './ticketpaymetbank.page';

const routes: Routes = [
  {
    path: '',
    component: TicketpaymetbankPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketpaymetbankPage]
})
export class TicketpaymetbankPageModule {}
