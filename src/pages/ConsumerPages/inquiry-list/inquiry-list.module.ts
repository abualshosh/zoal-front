import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { InquiryListPage } from "./inquiry-list";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [InquiryListPage],
  imports: [
    IonicPageModule.forChild(InquiryListPage),
    TranslateModule.forChild()
  ],
  exports: [InquiryListPage]
})
export class InquiryListPageModule {}
