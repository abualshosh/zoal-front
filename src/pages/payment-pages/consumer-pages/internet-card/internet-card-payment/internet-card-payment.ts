import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import * as uuid from "uuid";
import * as moment from "moment";
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StorageProvider } from '../../../../../providers/storage/storage';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { GetServicesProvider } from '../../../../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-internet-card-payment',
  templateUrl: 'internet-card-payment.html',
})
export class InternetCardPaymentPage {
  data: any;
  isGmpp: any;
  wallets: any;
  showWallet: boolean;
  cards: any;
  favorites: any;
  validCard: boolean;
  submitAttempt: boolean;
  
  isReadyToSave: any;

  todo = this.formBuilder.group({
    pan: [""],
    Card: ["", Validators.required],
    entityId: [""],
    mobilewallet: [""],
    IPIN: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern("[0-9]*")
      ])
    ],
  });
  amount: any;

  constructor(public events: Events,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    private translate: TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public modalCtrl: ModalController,

) {
    this.data = this.navParams.get("value")
    this.amount = this.navParams.get('amount')
      
    this.todo.valueChanges.subscribe(v => {
      this.isReadyToSave = this.todo.valid;
    });
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    this.subscribeToDataChanges();
    this.checkIsGmpp();
  }
  subscribeToDataChanges() {
    this.events.subscribe("data:updated", () => {
      this.clearInput();
      this.checkIsGmpp();
    });
  }
  checkIsGmpp() {
    this.isGmpp = this.navParams.get("isGmpp");
    if (this.isGmpp) {
      this.storageProvider.getWallets().then(wallets => {
        this.wallets = wallets;
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
        this.todo.controls["Card"].disable();
      });
    } else {
      this.storageProvider.getCards().subscribe(res => {
        this.cards = res.body
        this.showWallet = false;
        this.todo.controls["mobilewallet"].setValue(false);
        this.todo.controls["entityId"].disable();
      });
    }
    this.storageProvider.getFavorites().subscribe(favorites => {
      this.favorites = favorites.body;
    });
  }
  showFavorites() {
    if (this.favorites) {
      this.alertProvider.showRadio(this.favorites, "favorites").then(fav => {
        this.todo.controls["MerchantId"].setValue(fav);
        if (!this.todo.controls["MerchantId"].valid) {
          this.alertProvider.showToast("validMerchantIdError");
          this.todo.controls["MerchantId"].reset();
        }
      });
    }
  }

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["IPIN"].reset();
    if (this.cards) {
      if (this.cards.length <= 0) {
        this.showWallet = true;
        this.todo.controls["mobilewallet"].setValue(true);
      }
    } else {
      this.showWallet = true;
      this.todo.controls["mobilewallet"].setValue(true);
    }
  }

  onSelectChange(selectedValue: any) {
    var dat = this.todo.value;
    if (dat.Card && !dat.mobilewallet) {
      this.validCard = true;
    }
  }

  logForm() {
    const form = this.todo.value;
    if (form.Card && !form.mobilewallet) {
      this.validCard = true;
    }
    this.submitAttempt = true;
    if (this.todo.valid) {
      if (!form.mobilewallet && !this.validCard) {
        return;
      }

      const tranUuid = uuid.v4();
      console.log(form.IPIN);
      
      const request = {
        IPIN: this.serviceProvider.encrypt(tranUuid + form.IPIN),
        UUID: tranUuid,
        
        cardTypeId: this.data.id,
        expDate: form.mobilewallet ? null : form.Card.expDate,

        pan: form.mobilewallet ? null : form.Card.pan,

      };      

        this.serviceProvider
          .doTransaction(request, "consumer/internetCard")
          .subscribe((res:any) => {
            console.table(res);
          
            if (res != null && res.responseStatus === "Successful") {
              const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
                "DD/MM/YYYY  hh:mm:ss"
              );
              const main = [{ "": res.tranAmount }];
              let dat = [];

              if (res.PAN) {
                dat.push({ Card: res.PAN });
              } else {
                dat.push({ WalletNumber: res.entityId });
              }

              dat.push({
                serviceInfo: res.serviceInfo,
                fees:
                  this.calculateFees(res) !== 0 ? this.calculateFees(res) : null,
                date: datetime
              });

              let modal = this.modalCtrl.create(
                "TransactionDetailPage",
                { data: dat, main: main },
                { cssClass: "inset-modal" }
              );
              modal.present();
              this.clearInput();
              this.submitAttempt = false;
            } else {
              this.alertProvider.showAlert(res);
              this.clearInput();

              this.submitAttempt = false;
            }
          });
      }
    
  }

  calculateFees(response) {
    let fees = 0;
    if (response.acqTranFee) {
      fees += response.acqTranFee;
    }

    if (response.issuerTranFee) {
      fees += response.issuerTranFee;
    }

    if (response.dynamicFees) {
      fees += response.dynamicFees;
    }

    return fees;
  }
}
