import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams
} from "ionic-angular";
import { Api } from "../../../providers/api/api";

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
    public navParams: NavParams,
    public api: Api
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

  ionViewDidLoad() {}
}
