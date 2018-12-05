import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeIpinPage } from './change-ipin';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ChangeIpinPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeIpinPage),
      TranslateModule.forChild()
  ],
  exports: [
    ChangeIpinPage
  ]
})
export class ChangeIpinPageModule {}
