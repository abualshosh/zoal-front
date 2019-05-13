import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-load-pages",
  templateUrl: "load-pages.html"
})
export class LoadPagesPage {
  pages: any[];
  title: string;
  isGmpp: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = this.navParams.get("pages");
    this.title = this.navParams.get("title");
    this.isGmpp = this.navParams.get("isGmpp");
  }

  ionViewDidLoad() {}

  openPage(page, param) {
    if (param) {
      this.navCtrl.push(page, {
        param: param,
        isGmpp: this.isGmpp
      });
    } else {
      this.navCtrl.push(page, {
        isGmpp: this.isGmpp
      });
    }
  }
}
