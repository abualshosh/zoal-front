import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppCashOutPage } from './gmpp-cash-out';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    GmppCashOutPage,
  ],
  imports: [
    IonicPageModule.forChild(GmppCashOutPage),
        TranslateModule.forChild()
  ],
  exports: [
    GmppCashOutPage
  ]
})
export class GmppCashOutPageModule {}
