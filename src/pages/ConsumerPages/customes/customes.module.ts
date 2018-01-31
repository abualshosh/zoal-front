import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomesPage } from './customes';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    CustomesPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomesPage),
            TranslateModule.forChild()
  ],
  exports: [
    CustomesPage
  ]
})
export class CustomesPageModule {}
