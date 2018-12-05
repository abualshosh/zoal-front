import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillInquiryPage } from './bill-inquiry';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    BillInquiryPage,
  ],
  imports: [
    IonicPageModule.forChild(BillInquiryPage),
     TranslateModule.forChild()
  ],
  exports: [
    BillInquiryPage
  ]
})
export class BillInquiryPageModule {}
