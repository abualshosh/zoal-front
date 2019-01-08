import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppTranToWalletPage } from "./gmpp-tran-to-wallet";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppTranToWalletPage],
  imports: [
    IonicPageModule.forChild(GmppTranToWalletPage),
    TranslateModule.forChild()
  ],
  exports: [GmppTranToWalletPage]
})
export class GmppTranToWalletPageModule {}
