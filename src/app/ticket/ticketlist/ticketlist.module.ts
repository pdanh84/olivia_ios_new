import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TicketListPage } from './ticketlist.page';


@NgModule({
  declarations: [
    TicketListPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TicketListPage
      }
    ])
  ],
})
export class TicketListPageModule {}
