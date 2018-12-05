import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCardModelPage } from './add-card-model';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AddCardModelPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCardModelPage),
      TranslateModule.forChild()
  ],
  exports: [
    AddCardModelPage
  ]
})
export class AddCardModelPageModule {}
