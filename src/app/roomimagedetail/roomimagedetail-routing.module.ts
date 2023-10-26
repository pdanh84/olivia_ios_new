import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomimagedetailPage } from './roomimagedetail.page';

const routes: Routes = [
  {
    path: '',
    component: RoomimagedetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomimagedetailPageRoutingModule {}
