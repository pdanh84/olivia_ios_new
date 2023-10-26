import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketPriceDetailPage } from './ticketpricedetail.page';

@NgModule({
  declarations: [
    TicketPriceDetailPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: TicketPriceDetailPage
    }]),
  ],
})
export class TicketPriceDetailPageModule {}
