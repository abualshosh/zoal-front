import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PostCreatePage } from "./post-create";
import { IonicImageLoader } from "ionic-image-loader";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [PostCreatePage],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(PostCreatePage),
    TranslateModule.forChild()
  ]
})
export class PostCreatePageModule {}
