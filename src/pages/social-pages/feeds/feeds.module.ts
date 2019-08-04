import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { FeedsPage } from "./feeds";
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [FeedsPage],
  imports: [
    PipesModule,
    IonicPageModule.forChild(FeedsPage),
    TranslateModule.forChild()
  ]
})
export class FeedsPageModule {}
