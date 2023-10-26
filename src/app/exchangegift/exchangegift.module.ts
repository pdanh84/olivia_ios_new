import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExchangeGiftPage } from './exchangegift';

@NgModule({
  declarations: [
    ExchangeGiftPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExchangeGiftPage
      }
    ])
  ],
})
export class ExchangeGiftPageModule {}