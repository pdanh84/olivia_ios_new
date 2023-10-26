import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { OrderRequestAddluggagePaymentAtOfficePage } from './orderrequestaddluggagepaymentatoffice.page';

@NgModule({
  declarations: [
    OrderRequestAddluggagePaymentAtOfficePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OrderRequestAddluggagePaymentAtOfficePage
      }
    ])
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class OrderRequestAddluggagePaymentAtOfficePageModule {}
