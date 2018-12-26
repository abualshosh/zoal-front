import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ReModelPage } from "./re-model";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [ReModelPage],
  imports: [IonicPageModule.forChild(ReModelPage), TranslateModule.forChild()],
  exports: [ReModelPage]
})
export class ReModelPageModule {}
