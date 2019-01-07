import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PaymentMethodPage } from "./payment-method";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [PaymentMethodPage],
  imports: [
    IonicPageModule.forChild(PaymentMethodPage),
    TranslateModule.forChild()
  ]
})
export class PaymentMethodPageModule {}
