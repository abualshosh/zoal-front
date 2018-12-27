import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { RetireaccountPage } from "./retireaccount";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [RetireaccountPage],
  imports: [
    IonicPageModule.forChild(RetireaccountPage),
    TranslateModule.forChild()
  ],
  exports: [RetireaccountPage]
})
export class RetireaccountPageModule {}
