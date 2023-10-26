import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TopDealListPage } from './topdeallist';

@NgModule({
  declarations: [
    TopDealListPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: TopDealListPage
    }]),
  ],
})
export class TopDealListPageModule {}
