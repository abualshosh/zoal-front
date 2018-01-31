import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrGeneratorPage } from './qr-generator';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [
    QrGeneratorPage,
  ],
  imports: [
    NgxQRCodeModule,
    IonicPageModule.forChild(QrGeneratorPage),
  ],
})
export class QrGeneratorPageModule {}
