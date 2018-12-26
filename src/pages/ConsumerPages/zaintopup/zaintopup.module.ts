import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ZaintopupPage } from "./zaintopup";
import { TranslateModule } from "@ngx-translate/core";
import { KeysPipeModule } from "../../../app/pipekeymodule";

@NgModule({
  declarations: [ZaintopupPage],
  imports: [
    IonicPageModule.forChild(ZaintopupPage),
    TranslateModule.forChild(),
    KeysPipeModule
  ],
  exports: [ZaintopupPage]
})
export class ZaintopupPageModule {}
