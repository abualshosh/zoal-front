import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppInquiryPage } from "./gmpp-inquiry";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppInquiryPage],
  imports: [
    IonicPageModule.forChild(GmppInquiryPage),
    TranslateModule.forChild()
  ],
  exports: [GmppInquiryPage]
})
export class GmppInquiryPageModule {}
