import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MobileCreditPage } from "./mobile-credit";
import { TranslateModule } from "@ngx-translate/core";
import { KeysPipeModule } from "../../../../app/pipekeymodule";

@NgModule({
  declarations: [MobileCreditPage],
  imports: [
    IonicPageModule.forChild(MobileCreditPage),
    TranslateModule.forChild(),
    KeysPipeModule
  ],
  exports: [MobileCreditPage]
})
export class MobileCreditPageModule {}
