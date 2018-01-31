import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppBalancePage } from './gmpp-balance';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    GmppBalancePage,
  ],
  imports: [
    IonicPageModule.forChild(GmppBalancePage),
      TranslateModule.forChild()
  ],
  exports: [
    GmppBalancePage
  ]
})
export class GmppBalancePageModule {}
