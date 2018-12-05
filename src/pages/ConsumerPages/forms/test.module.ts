import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormsPage } from './test';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    FormsPage,
  ],
  imports: [
    IonicPageModule.forChild(FormsPage),
    TranslateModule.forChild()
  ],
  exports: [
    FormsPage
  ]
})
export class FormsPageModule {}