import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SudaniBillPaymentPage } from './sudani-bill-payment';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SudaniBillPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(SudaniBillPaymentPage),
    TranslateModule.forChild()
  ],
})
export class SudaniBillPaymentPageModule {}
