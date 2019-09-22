import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EInvoicePage } from './e-invoice';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EInvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(EInvoicePage),
    TranslateModule.forChild()
  ],
})
export class EInvoicePageModule {}
