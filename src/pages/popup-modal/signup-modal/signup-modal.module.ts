import { SignupModalPage } from './signup-modal';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SignupModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupModalPage),
    TranslateModule.forChild()
  ],
  exports: [
    SignupModalPage
  ]
})

export class SignupModalPageModule { }
