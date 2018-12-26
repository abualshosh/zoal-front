import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LockPage } from "./lock";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [LockPage],
  imports: [IonicPageModule.forChild(LockPage), TranslateModule.forChild()],
  exports: [LockPage]
})
export class LockPageModule {}
