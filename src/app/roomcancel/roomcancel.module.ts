import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RoomCancelPage } from './roomcancel';

@NgModule({
  declarations: [
    RoomCancelPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild( [{
      path: '',
      component: RoomCancelPage
    }]),
  ],
})
export class RoomCancelPageModule {}