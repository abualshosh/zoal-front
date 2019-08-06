import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Events
} from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Item, StorageProvider } from "../../providers/storage/storage";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: "page-item-create",
  templateUrl: "item-create.html"
})
export class ItemCreatePage {
  private form: FormGroup;
  submitAttempt = false;
  item: Item;
  newItem: Item;
  key: any;
  pageTitle: string;
  isReadyToSave: boolean;

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public storageProvider: StorageProvider,
    private formBuilder: FormBuilder
  ) {
    this.item = navParams.get("item");
    this.key = navParams.get("key");

    this.form = this.formBuilder.group({
      walletNumber: [
        navParams.get("item") ? this.item.walletNumber : "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("0[0-9]*")
        ])
      ],
      cardNumber: [
        navParams.get("item") ? this.item.cardNumber : "",
        Validators.compose([
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(19),
          Validators.pattern("[0-9]*")
        ])
      ],
      expDate: [
        navParams.get("item") ? this.formatFromDate(this.item.expDate) : "",
        Validators.required
      ],
      favoriteText: [
        navParams.get("item") ? this.item.favoriteText : "",
        Validators.required
      ],
      name: [navParams.get("item") ? this.item.name : "", Validators.required]
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {
    this.checkFormType();
  }

  checkFormType() {
    if (this.key == "wallets") {
      this.form.controls["cardNumber"].disable();
      this.form.controls["expDate"].disable();
      this.form.controls["favoriteText"].disable();
      this.pageTitle = "gmppWalletDetailPage";
    } else if (this.key == "cards") {
      this.form.controls["walletNumber"].disable();
      this.form.controls["favoriteText"].disable();
      this.pageTitle = "cardDetailPage";
    } else if (this.key == "favorites") {
      this.form.controls["cardNumber"].disable();
      this.form.controls["expDate"].disable();
      this.form.controls["walletNumber"].disable();
      this.pageTitle = "favoriteDetailPage";
    }
  }

  submitForm() {
    if (this.navParams.get("item")) {
      this.updateItem();
    } else {
      this.addItem();
    }
  }

  addItem() {
    this.submitAttempt = true;
    if (this.form.valid) {
      this.newItem = new Item(Date.now());

      if (this.key == "wallets") {
        this.newItem.walletNumber =
          "249" +
          this.form.controls["walletNumber"].value.substring(
            1,
            this.form.controls["walletNumber"].value.length
          );
      }

      if (this.key == "cards") {
        this.newItem.cardNumber = this.form.controls["cardNumber"].value;
        this.newItem.expDate = this.formatDate(
          this.form.controls["expDate"].value
        );
      }

      if (this.key == "favorites") {
        this.newItem.favoriteText = this.form.controls["favoriteText"].value;
      }

      this.newItem.name = this.form.controls["name"].value;

      this.storageProvider.addItem(this.newItem, this.key).then(item => {
        this.submitAttempt = false;
        this.events.publish("data:updated", "");
        this.viewCtrl.dismiss();
      });
    }
  }

  updateItem() {
    this.submitAttempt = true;
    if (this.form.valid) {
      if (this.key == "wallets") {
        this.item.walletNumber = this.form.controls["walletNumber"].value;
      }

      if (this.key == "cards") {
        this.item.cardNumber = this.form.controls["cardNumber"].value;
        this.item.expDate = this.formatDate(
          this.form.controls["expDate"].value
        );
      }

      if (this.key == "favorites") {
        this.item.favoriteText = this.form.controls["favoriteText"].value;
      }

      this.item.name = this.form.controls["name"].value;

      this.storageProvider.updateItem(this.item, this.key).then(item => {
        this.submitAttempt = false;
        this.events.publish("data:updated", "");
        this.viewCtrl.dismiss();
      });
    }
  }

  formatDate(formDate) {
    return moment(formDate).format("YYMM");
  }

  formatFromDate(expDate) {
    return moment(expDate, "YYMM").format();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
}
