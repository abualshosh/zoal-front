import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GmppPaymentListPage } from "./gmpp-payment-list";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GmppPaymentListPage],
  imports: [
    IonicPageModule.forChild(GmppPaymentListPage),
    TranslateModule.forChild()
  ],
  exports: [GmppPaymentListPage]
})
export class GmppPaymentListPageModule {}
