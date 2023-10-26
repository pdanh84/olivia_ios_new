import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchHotelFilterAgainPage } from './search-hotel-filter-again';

@NgModule({
  declarations: [
    SearchHotelFilterAgainPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: SearchHotelFilterAgainPage
    }]),
  ],
})
export class SearchHotelFilterAgainPageModule {}
