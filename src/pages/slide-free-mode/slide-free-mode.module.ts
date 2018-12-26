import { SlideFreeModePage } from "./slide-free-mode";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [SlideFreeModePage],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(SlideFreeModePage),
    TranslateModule.forChild()
  ],
  exports: [SlideFreeModePage]
})
export class SlideFreeModePageModule {}
