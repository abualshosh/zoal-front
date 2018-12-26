import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { E15Page } from "./e15";
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [E15Page],
  imports: [IonicPageModule.forChild(E15Page), TranslateModule.forChild()],
  exports: [E15Page]
})
export class E15PageModule {}
