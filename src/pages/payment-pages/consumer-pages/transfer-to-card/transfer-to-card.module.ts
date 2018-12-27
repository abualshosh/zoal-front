import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TransferToCardPage } from "./transfer-to-card";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [TransferToCardPage],
  imports: [
    IonicPageModule.forChild(TransferToCardPage),
    TranslateModule.forChild()
  ],
  exports: [TransferToCardPage]
})
export class TransferToCardPageModule {}
