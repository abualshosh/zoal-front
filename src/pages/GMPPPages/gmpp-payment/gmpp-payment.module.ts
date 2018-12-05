import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppPaymentPage } from './gmpp-payment';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    GmppPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(GmppPaymentPage),
            TranslateModule.forChild()
  ],
  exports: [
    GmppPaymentPage
  ]
})
export class GmppPaymentPageModule {}
