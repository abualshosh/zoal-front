import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { BranchesPage } from "./branches";
import { KeysPipeModule } from "../../app/pipekeymodule";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [BranchesPage],
  imports: [
    IonicPageModule.forChild(BranchesPage),
    TranslateModule.forChild(),
    KeysPipeModule
  ],
  exports: [BranchesPage]
})
export class BranchesPageModule {}
