import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketServiceDetailPage } from './ticketservicedetail.page';

@NgModule({
  declarations: [
    TicketServiceDetailPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: TicketServiceDetailPage
    }]),
  ],
})
export class TicketServiceDetailPageModule {}
