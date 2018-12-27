import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecialPaymentPage } from './special-payment';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SpecialPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecialPaymentPage),
    TranslateModule.forChild()
  ],
  exports: [
    SpecialPaymentPage
  ]
})
export class SpecialPaymentPageModule {}
