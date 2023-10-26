import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShuttlebusnotePageRoutingModule } from './shuttlebusnote-routing.module';

import { ShuttlebusnotePage } from './shuttlebusnote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShuttlebusnotePageRoutingModule
  ],
  declarations: [ShuttlebusnotePage]
})
export class ShuttlebusnotePageModule {}
