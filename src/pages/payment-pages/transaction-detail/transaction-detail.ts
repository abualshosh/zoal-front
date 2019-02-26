import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { SocialSharing } from "@ionic-native/social-sharing";

@IonicPage()
@Component({
  selector: "page-transaction-detail",
  templateUrl: "transaction-detail.html"
})
export class TransactionDetailPage {
  public items: any[] = [];
  public main: any[] = [];
  msg: string = "";

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public translateService: TranslateService,
    private socialSharing: SocialSharing,
    public navParams: NavParams
  ) {
    this.items = this.navParams.get("data");
    this.main = this.navParams.get("main");

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].tranCurrency) {
        translateService.get(["SDG"]).subscribe(values => {
          this.items[i].tranCurrency = values["SDG"];
        });
      }

      if (this.items[i].Card) {
        let stars = "";
        for (let index = 0; index < this.items[i].Card.length - 10; index++) {
          stars += "*";
        }
        this.items[i].Card = this.items[i].Card.replace(
          this.items[i].Card.substring(6, this.items[i].Card.length - 4),
          stars
        );
      }
    }
  }

  share() {
    // this.msg = this.compileMsg();
    alert(this.msg);
    // this.socialSharing.share(this.msg, null, null, null);
  }

  compileShareMsg(key, value) {
    this.msg = this.msg + key + " : " + value + "\n";
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
