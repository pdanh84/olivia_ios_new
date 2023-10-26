import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomimagedetailPageRoutingModule } from './roomimagedetail-routing.module';

import { RoomimagedetailPage } from './roomimagedetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomimagedetailPageRoutingModule
  ],
  declarations: [RoomimagedetailPage]
})
export class RoomimagedetailPageModule {}
