import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LoadPagesPage } from "./load-pages";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [LoadPagesPage],
  imports: [
    IonicPageModule.forChild(LoadPagesPage),
    TranslateModule.forChild()
  ],
  exports: [LoadPagesPage]
})
export class LoadPagesPageModule {}
