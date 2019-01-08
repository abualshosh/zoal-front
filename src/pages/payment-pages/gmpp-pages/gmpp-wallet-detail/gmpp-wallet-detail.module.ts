import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppWalletDetailPage } from "./gmpp-wallet-detail";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [GmppWalletDetailPage],
  imports: [
    IonicPageModule.forChild(GmppWalletDetailPage),
    TranslateModule.forChild()
  ],
  exports: [GmppWalletDetailPage]
})
export class GmppWalletDetailPageModule {}
