import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MytripHistoryPage } from './mytriphistory.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MytripHistoryPage],
  exports: [MytripHistoryPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MytripHistoryPageModule {}
