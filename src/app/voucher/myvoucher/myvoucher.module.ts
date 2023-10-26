import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyVoucherPage } from './myvoucher.page';

@NgModule({
  declarations: [
    MyVoucherPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: MyVoucherPage
    }]),
  ],
})
export class MyVoucherPageModule {}