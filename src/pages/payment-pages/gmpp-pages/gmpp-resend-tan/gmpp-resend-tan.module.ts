import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppResendTanPage } from "./gmpp-resend-tan";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppResendTanPage],
  imports: [
    IonicPageModule.forChild(GmppResendTanPage),
    TranslateModule.forChild()
  ],
  exports: [GmppResendTanPage]
})
export class GmppResendTanPageModule {}
