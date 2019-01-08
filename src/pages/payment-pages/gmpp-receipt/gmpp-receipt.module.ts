import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppReceiptPage } from "./gmpp-receipt";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppReceiptPage],
  imports: [
    IonicPageModule.forChild(GmppReceiptPage),
    TranslateModule.forChild()
  ],
  exports: [GmppReceiptPage]
})
export class GmppReceiptPageModule {}
