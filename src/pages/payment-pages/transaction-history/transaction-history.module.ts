import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TransactionHistoryPage } from "./transaction-history";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [TransactionHistoryPage],
  imports: [
    IonicPageModule.forChild(TransactionHistoryPage),
    TranslateModule.forChild()
  ]
})
export class TransactionHistoryPageModule {}
