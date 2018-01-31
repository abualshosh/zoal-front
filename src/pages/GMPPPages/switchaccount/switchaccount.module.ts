import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwitchaccountPage } from './switchaccount';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    SwitchaccountPage,
  ],
  imports: [
    IonicPageModule.forChild(SwitchaccountPage),
        TranslateModule.forChild()
  ],
  exports: [
    SwitchaccountPage
  ]
})
export class SwitchaccountPageModule {}
