import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PostCreatePage } from "./post-create";
import { TranslateModule } from "@ngx-translate/core";
import { IonicImageLoader } from "ionic-image-loader";

@NgModule({
  declarations: [PostCreatePage],
  imports: [
    IonicPageModule.forChild(PostCreatePage),
    TranslateModule.forChild(),
    IonicImageLoader
  ]
})
export class PostCreatePageModule {}
