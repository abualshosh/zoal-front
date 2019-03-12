import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController, Events } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-gmpp-link-account",
  templateUrl: "gmpp-link-account.html"
})
export class GmppLinkAccountPage {
  // consumerIdentifier: any;
  private todo: FormGroup;
  private complate: FormGroup;
  public wallets: Item[];
  public compleate: any = "FALSE";
  public submitAttempt: boolean = false;

  public GetServicesProvider: GetServicesProvider;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public GetServicesProviderg: GetServicesProvider,
    public alertProvider: AlertProvider,
    public storage: Storage,
    public storageProvider: StorageProvider,
    public modalCtrl: ModalController
  ) {
    //  this.compleate='TRUE';
    //console.log(this.compleate);
    this.GetServicesProvider = GetServicesProviderg;

    

    this.todo = this.formBuilder.group({
      walletNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("[249].[0-9]*")
        ])
      ],
      primaryAccountNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(16),
          Validators.pattern("[0-9]*")
        ])
      ],
      consumerPIN: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern("[0-9]*")
        ])
      ]
    });

    this.complate = this.formBuilder.group({
      consumerOTP: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    // this.consumerIdentifier = "249" + localStorage.getItem("username");

    this.storage.get("LINKACCOUNT").then(val => {
      // this.storage.set('LINKACCOUNT','TRUE');
      //      this.storage.set("LINKUUID","539e08e8-3aa2-4ad9-8529-e5d5211203b8");
      // this.storage.set("primaryAccountNumber","9222060108520070");
      if (val != null) {
        this.compleate = val;
      }
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
        
      }
    });
  }

  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.todo.reset();
      this.loadWallets();
    });
  }

  

  Cancle() {
    this.storage.set("LINKACCOUNT", "FALSE");
    this.storage.set("LINKUUID", null);
    this.storage.set("primaryAccountNumber", null);
    this.compleate = "FALSE";
  }

  logForm() {
    this.submitAttempt = true;
    if (this.todo.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.todo.value;

      dat.UUID = uuid.v4();
      dat.consumerPIN = this.GetServicesProvider.encryptGmpp(
        dat.UUID + dat.consumerPIN
      );
      dat.consumerIdentifier = this.wallets[0].walletNumber;

      dat.isConsumer = "true";

      this.GetServicesProvider.load(this.todo.value, "gmpp/linkAccount").then(
        data => {
          if (data != null && data.responseCode == 930) {
            this.storage.set("LINKACCOUNT", "TRUE");
            this.storage.set("LINKUUID", dat.UUID);
            this.storage.set("primaryAccountNumber", dat.primaryAccountNumber);
            loader.dismiss();
            this.submitAttempt = false;

            // this.ionViewDidLoad();
            this.compleate = "TRUE";
            //     var datas =[
            //       {"tital":"Status","desc":data.responseMessage},
            //        {"tital":"SMS","desc":"An SMS will be sent shortly"},
            //            ];
            //        let modal = this.modalCtrl.create('GmppReceiptPage', {"data":datas},{ cssClass: 'inset-modal' });
            //   //   modal.present();

            // this.navCtrl.push(this.navCtrl.getActive().component);
          } else {
            loader.dismiss();
            this.alertProvider.showAlert(data);
            this.submitAttempt = false;
          }
        }
      );
    }
  }

  ComplateForm() {
    this.submitAttempt = true;
    if (this.complate.valid) {
      let loader = this.loadingCtrl.create();
      loader.present();
      var dat = this.complate.value;

      this.storage.get("LINKUUID").then(val => {
        if (val != null) {
          dat.originalTranUUID = val;
          this.storage.get("primaryAccountNumber").then(val => {
            if (val != null) {
              dat.primaryAccountNumber = val;

              dat.UUID = uuid.v4();
              // dat.consumerPIN=this.GetServicesProvider.encryptGmpp(dat.UUID+dat.consumerPIN);
              dat.consumerOTP = this.GetServicesProvider.encryptGmpp(
                dat.UUID + dat.consumerOTP
              );
              dat.consumerIdentifier = this.wallets[0].walletNumber;
              //console.log(this.complate.value)

              this.GetServicesProvider.load(
                this.complate.value,
                "gmpp/completeLinkAccount"
              ).then(data => {
                if (data != null && data.responseCode == 1) {
                  loader.dismiss();
                  var datas = [{ tital: "Status", desc: data.responseMessage }];
                  let modal = this.modalCtrl.create(
                    "GmppReceiptPage",
                    { data: datas },
                    { cssClass: "inset-modals" }
                  );
                  modal.present();
                  this.submitAttempt = false;
                  this.Cancle();
                  this.navCtrl.pop();
                } else {
                  this.submitAttempt = false;
                  loader.dismiss();
                  this.alertProvider.showAlert(data);
                }
              });
            }
          });
        }
      });
    }
  }
}
