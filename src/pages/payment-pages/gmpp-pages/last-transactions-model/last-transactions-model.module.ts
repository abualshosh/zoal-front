import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LastTransactionsModelPage } from "./last-transactions-model";
//import {KeysPipeModule} from '../../../app/pipekeymodule';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [LastTransactionsModelPage],
  imports: [
    IonicPageModule.forChild(LastTransactionsModelPage),
    //  KeysPipeModule,
    TranslateModule.forChild()
  ],
  exports: [LastTransactionsModelPage]
})
export class LastTransactionsModelPageModule {}
