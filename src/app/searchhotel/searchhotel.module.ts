import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchHotelPage } from './searchhotel';

@NgModule({
  declarations: [
    SearchHotelPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: SearchHotelPage
    }]),
  ],
})
export class SearchHotelPageModule {}
