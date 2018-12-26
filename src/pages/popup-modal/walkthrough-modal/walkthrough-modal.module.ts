import { WalkthroughModalPage } from "./walkthrough-modal";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [WalkthroughModalPage],
  imports: [
    IonicPageModule.forChild(WalkthroughModalPage),
    TranslateModule.forChild()
  ],
  exports: [WalkthroughModalPage]
})
export class WalkthroughModalPageModule {}
