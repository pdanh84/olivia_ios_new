import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InsurranceBankSelectPage } from './insurrancebankselect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [InsurranceBankSelectPage],
  exports: [InsurranceBankSelectPage]
})
export class InsurranceBankSelectPageModule {}
