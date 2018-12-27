import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CustomsInquiryPage } from "./customs-inquiry";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [CustomsInquiryPage],
  imports: [
    IonicPageModule.forChild(CustomsInquiryPage),
    TranslateModule.forChild()
  ],
  exports: [CustomsInquiryPage]
})
export class CustomsInquiryPageModule {}
