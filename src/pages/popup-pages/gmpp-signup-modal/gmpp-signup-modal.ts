import { Component } from "@angular/core";
import {
  ViewController,
  IonicPage,
  ModalController,
  NavController,
  LoadingController,
  Events
} from "ionic-angular";
import { GetServicesProvider } from "../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Api } from "../../../providers/providers";
import { Item, StorageProvider } from "../../../providers/storage/storage";
import { AlertProvider } from "../../../providers/alert/alert";
@IonicPage()
@Component({
  selector: "page-gmpp-signup-modal",
  templateUrl: "gmpp-signup-modal.html"
})
export class GmppSignupModalPage {
  profile: any;
  private todo: FormGroup;
  public wallets: Item[];
  submitAttempt: boolean = false;

  constructor(
    public events: Events,
    public loadingCtrl: LoadingController,
    public api: Api,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public GetServicesProvider: GetServicesProvider,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController
  ) {
    

    this.todo = this.formBuilder.group({
      walletNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249].[0-9]*")
        ])
      ]
    });
  }

  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.loadWallets();
  }

  loadWallets() {
    this.storageProvider.getWallets().then(wallets => {
      this.wallets = wallets;
      if (!this.wallets || this.wallets.length <= 0) {
        this.noWalletAvailable();
      }
    });
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadWallets();
    });
  }

  noWalletAvailable() {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create(
      "WalkthroughModalPage",
      {},
      { cssClass: "inset-modals" }
    );
    modal.present();
  }

  signup() {
    this.submitAttempt = true;
    let dat = this.todo.value;
    // var dat = {
    //   UUID: uuid.v4(),
    //   consumerIdentifier: "249" + localStorage.getItem("username")
    // };
    if (this.todo.valid) {
      dat.UUID = uuid.v4();
      dat.consumerIdentifier = this.wallets[0].walletNumber;
      let loader = this.loadingCtrl.create();
      loader.present();

      this.GetServicesProvider.load(dat, "gmpp/registerConsumer").then(data => {
        loader.dismiss();

        if (data.responseCode == 1) {
          this.storageProvider.getProfile().subscribe(val => {
            this.profile = val;
          });
          this.profile.phoneNumber = "249" + localStorage.getItem("username");
          this.api.put("/profiles", this.profile).subscribe(
            (res: any) => {
              this.submitAttempt = false;
              localStorage.setItem("profile", JSON.stringify(this.profile));
              var datas = [{ tital: "Status", desc: data.responseMessage }];
              let modal = this.modalCtrl.create(
                "GmppReceiptPage",
                { data: datas },
                { cssClass: "inset-modals" }
              );
              modal.present();
              this.viewCtrl.dismiss();
            },
            err => {
              this.submitAttempt = false;
              //console.log(err);
            }
          );
        } else {
          this.submitAttempt = false;
          this.alertProvider.showAlert(data);
        }
      });
    }
  }

  dismiss() {
    this.storageProvider.getProfile().subscribe(val => {
      this.profile = val;
    });
    localStorage.setItem("profile", JSON.stringify(this.profile));
    this.viewCtrl.dismiss();
  }
}
