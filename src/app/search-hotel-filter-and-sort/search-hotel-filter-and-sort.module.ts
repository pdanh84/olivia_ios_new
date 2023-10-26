import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchHotelFilterAndSortPage } from './search-hotel-filter-and-sort';

@NgModule({
  declarations: [
    SearchHotelFilterAndSortPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: SearchHotelFilterAndSortPage
    }]),
    //IonicPageModule.forChild(SearchHotelFilterAndSortPage),
  ],
})
export class SearchHotelFilterAndSortPageModule {}
