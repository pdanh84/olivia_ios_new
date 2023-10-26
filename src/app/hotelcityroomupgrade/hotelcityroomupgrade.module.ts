import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelCityRoomUpgradePage } from './hotelcityroomupgrade';

@NgModule({
  declarations: [
    HotelCityRoomUpgradePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HotelCityRoomUpgradePage
      }
    ])
  ],
})
export class HotelCityRoomUpgradePageModule {}
