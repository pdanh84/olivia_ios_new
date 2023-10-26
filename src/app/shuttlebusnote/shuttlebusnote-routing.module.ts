import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShuttlebusnotePage } from './shuttlebusnote.page';

const routes: Routes = [
  {
    path: '',
    component: ShuttlebusnotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShuttlebusnotePageRoutingModule {}
