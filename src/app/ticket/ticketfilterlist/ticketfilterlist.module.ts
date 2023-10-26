import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TicketfilterlistPage } from './ticketfilterlist.page';

const routes: Routes = [
  {
    path: '',
    component: TicketfilterlistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TicketfilterlistPage]
})
export class TicketfilterlistPageModule {}
