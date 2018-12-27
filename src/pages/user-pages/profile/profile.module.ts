import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProfilePage } from "./profile";
import { IonicImageLoader } from "ionic-image-loader";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(ProfilePage),
    TranslateModule.forChild()
  ],
  exports: [ProfilePage]
})
export class ProfilePageModule {}
