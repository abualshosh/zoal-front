import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GetBalancePage } from "./get-balance";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [GetBalancePage],
  imports: [
    IonicPageModule.forChild(GetBalancePage),
    TranslateModule.forChild()
  ],
  exports: [GetBalancePage]
})
export class GetBalancePageModule {}
