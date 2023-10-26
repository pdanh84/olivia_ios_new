import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlightComboReviewsPage } from './flightcomboreviews';
import { VoucherSlideFlightComboPageModule } from '../voucher/voucherslideflightcombo/voucherslideflightcombo.module';

@NgModule({
  declarations: [
    FlightComboReviewsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoucherSlideFlightComboPageModule,
    RouterModule.forChild([
      {
        path: '',
        component: FlightComboReviewsPage
      }
    ])
  ],
})
export class FlightComboReviewsPageModule {}
