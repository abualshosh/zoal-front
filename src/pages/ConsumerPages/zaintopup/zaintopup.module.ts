import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ZaintopupPage } from './zaintopup';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ZaintopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ZaintopupPage),
        TranslateModule.forChild()
  ],
  exports: [
    ZaintopupPage
  ]
})
export class ZaintopupPageModule {}
