import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TransactionDetailPage } from "./transaction-detail";
import { KeysPipeModule } from "../../../app/pipekeymodule";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [TransactionDetailPage],
  imports: [
    IonicPageModule.forChild(TransactionDetailPage),
    TranslateModule.forChild(),
    KeysPipeModule
  ],
  exports: [TransactionDetailPage]
})
export class TransactionDetailPageModule {}
