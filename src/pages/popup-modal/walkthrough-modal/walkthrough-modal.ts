import { Component } from '@angular/core';
import { ViewController, IonicPage,ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-walkthrough-modal',
  templateUrl: 'walkthrough-modal.html'
})
export class WalkthroughModalPage {

  slides = [
    {
      title: 'Dream\'s Adventure',
      imageUrl: 'assets/img/slides/square.png',
      songs: 2,
    },
    {
      title: 'Really nice game',
      imageUrl: 'assets/img/slides/square-2.jpg',
      songs: 4,
    },
    {
      title: 'For the Weekend',
      imageUrl: 'assets/img/slides/square-3.jpg',
      songs: 4,
    },
  ];

  constructor(public modalCtrl:ModalController,public viewCtrl: ViewController) { }
  gmpp() {
    let modal=this.modalCtrl.create('SignupModalPage', {},{ cssClass: 'inset-modals' });
    modal.present();
    this.viewCtrl.dismiss();
  }
  consumer() {
    let modal=this.modalCtrl.create('HintModalPage', {},{ cssClass: 'inset-modals' });
    modal.present();
    this.viewCtrl.dismiss();  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
