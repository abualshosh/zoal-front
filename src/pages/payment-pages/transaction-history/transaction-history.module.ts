import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TransactionHistoryPage } from "./transaction-history";
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../../pipes/pipes.module";
@NgModule({
  declarations: [TransactionHistoryPage],
  imports: [
    PipesModule,
    IonicPageModule.forChild(TransactionHistoryPage),
    TranslateModule.forChild()
  ]
})
export class TransactionHistoryPageModule {}
