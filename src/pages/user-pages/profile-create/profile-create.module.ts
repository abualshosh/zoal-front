import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { IonicPageModule } from "ionic-angular";

import { ProfileCreatePage } from "./profile-create";
import { IonicImageLoader } from "ionic-image-loader";

@NgModule({
  declarations: [ProfileCreatePage],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(ProfileCreatePage),
    TranslateModule.forChild()
  ],
  exports: [ProfileCreatePage]
})
export class ProfileCreatePageModule {}
