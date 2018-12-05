import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GmppTrnasactionsPage } from './gmpp-trnasactions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GmppTrnasactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(GmppTrnasactionsPage),
        TranslateModule.forChild()
  ],
  exports: [
    GmppTrnasactionsPage
  ]
})
export class GmppTrnasactionsPageModule {}
