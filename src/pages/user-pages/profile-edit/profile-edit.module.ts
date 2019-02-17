import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProfileEditPage } from "./profile-edit";
import { IonicImageLoader } from "ionic-image-loader";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ProfileEditPage],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(ProfileEditPage),
    TranslateModule.forChild()
  ],
  exports: [ProfileEditPage]
})
export class ProfileEditPageModule {}
