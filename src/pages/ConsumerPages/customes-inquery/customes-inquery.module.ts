import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomesInqueryPage } from './customes-inquery';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CustomesInqueryPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomesInqueryPage),
         TranslateModule.forChild()
  ],
  exports: [
    CustomesInqueryPage
  ]
})
export class CustomesInqueryPageModule {}
