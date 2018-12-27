import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { BillInquiryListPage } from "./bill-inquiry-list";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [BillInquiryListPage],
  imports: [
    IonicPageModule.forChild(BillInquiryListPage),
    TranslateModule.forChild()
  ],
  exports: [BillInquiryListPage]
})
export class BillInquiryListPageModule {}
