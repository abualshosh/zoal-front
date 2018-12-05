import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnLockPage } from './un-lock';

@NgModule({
  declarations: [
    UnLockPage,
  ],
  imports: [
    IonicPageModule.forChild(UnLockPage),
  ],
  exports: [
    UnLockPage
  ]
})
export class UnLockPageModule {}
