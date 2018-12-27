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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = this.navParams.get("pages");
    this.title = this.navParams.get("title");
  }

  ionViewDidLoad() {}

  openPage(page, name) {
    if (name) {
      this.navCtrl.push(page, {
        name: name
      });
    } else {
      this.navCtrl.push(page);
    }
  }
}
