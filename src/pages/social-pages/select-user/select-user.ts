import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams
} from "ionic-angular";

/**
 * Generated class for the SelectUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-select-user",
  templateUrl: "select-user.html"
})
export class SelectUserPage {
  connections: any = [];
  username: any;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.username = localStorage.getItem("username");
    this.connections = JSON.parse(localStorage.getItem("connections"));
  }

  dismissWithConnection(contact) {
    this.viewCtrl.dismiss(contact.userName);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SelectUserPage');
  }
}
