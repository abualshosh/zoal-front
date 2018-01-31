import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppBankCardPage } from './gmpp-bank-card';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GmppBankCardPage,
  ],
  imports: [
    IonicPageModule.forChild(GmppBankCardPage),
        TranslateModule.forChild()
  ],
  exports: [
    GmppBankCardPage
  ]
})
export class GmppBankCardPageModule {}
