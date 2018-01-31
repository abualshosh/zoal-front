import { SlideFreeModePage } from './slide-free-mode';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    SlideFreeModePage,
  ],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(SlideFreeModePage),
  ],
  exports: [
    SlideFreeModePage
  ]
})

export class SlideFreeModePageModule { }
