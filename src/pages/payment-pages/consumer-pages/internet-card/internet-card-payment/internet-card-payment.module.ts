import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InternetCardPaymentPage } from './internet-card-payment';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    InternetCardPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(InternetCardPaymentPage),
    TranslateModule.forChild()

  ],
})
export class InternetCardPaymentPageModule {}
