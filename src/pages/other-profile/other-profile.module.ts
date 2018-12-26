import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OtherProfilePage } from "./other-profile";
import { IonicImageLoader } from "ionic-image-loader";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [OtherProfilePage],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(OtherProfilePage),
    TranslateModule.forChild()
  ],
  exports: [OtherProfilePage]
})
export class OtherProfilePageModule {}
