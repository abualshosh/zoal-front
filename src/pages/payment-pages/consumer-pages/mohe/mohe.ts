import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events
} from "ionic-angular";
import * as moment from "moment";
import { Validators, FormBuilder } from "@angular/forms";
import { GetServicesProvider } from "../../../../providers/get-services/get-services";
import * as uuid from "uuid";
import { Item, StorageProvider } from "../../../../providers/storage/storage";
import { AlertProvider } from "../../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-mohe",
  templateUrl: "mohe.html"
})
export class MohePage {
  profile: any;
  showWallet: boolean = false;
  public cards: any[] = [];
  public wallets: Item[] = [];
  public payee: any[] = [];
  public isArab = false;
  validCard: boolean = false;
  submitAttempt: boolean = false;
  CourseIDs: Array<{ title: string; id: any }> = [
    { title: "Academic", id: "1" },
    { title: "Agricultural", id: "2" },
    { title: "commercial", id: "3" },
    { title: "Industrial", id: "4" },
    { title: "Womanly", id: "5" },
    { title: "Ahlia", id: "6" },
    { title: "Readings", id: "7" }
  ];
  FormKinds: Array<{ title: string; id: any }> = [
    { title: "General admission-first round", id: "1" },
    { title: "Specialadmission", id: "2" },
    { title: "Sons of higher education staff", id: "3" },
    { title: "General admission-second round", id: "6" },
    { title: "Special admission-vacant seats", id: "7" },
    { title: "Private institutions direct admission", id: "8" },
    { title: "Diploma in public institutions", id: "9" }
  ];

  public type: any = "mohe";
  isGmpp: boolean;
  favorites: Item[];

  isReadyToSave: boolean;

  todo = this.formBuilder.group({
    pan: [""],
    Card: ["", Validators.required],
    Payee: [""],
    entityId: [""],
    CourseID: ["", Validators.required],
    FormKind: ["", Validators.required],
    IPIN: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern("[0-9]*")
      ])
    ],
    SETNUMBER: [
      "",
      Validators.compose([Validators.required, Validators.pattern("[0-9]*")])
    ],
    STUCNAME: ["", Validators.required],
    STUCPHONE: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("0[0-9]*")
      ])
    ],
    Amount: ["", Validators.required],
    mobilewallet: [""]
  });

  constructor(
    public events: Events,
    private formBuilder: FormBuilder,
    public serviceProvider: GetServicesProvider,
    public navCtrl: NavController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.todo.controls["mobilewallet"].setValue(false);
    this.checkType(event);

    this.todo.valueChanges.subscribe(v => {
      this.isReadyToSave = this.todo.valid;
    });
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

  clearInput() {
    this.todo.controls["pan"].reset();
    this.todo.controls["Card"].reset();
    this.todo.controls["entityId"].reset();
    this.todo.controls["Payee"].reset();
    this.todo.controls["IPIN"].reset();
    this.todo.controls["CourseID"].reset();
    this.todo.controls["FormKind"].reset();
    this.todo.controls["SETNUMBER"].reset();
    this.todo.controls["STUCNAME"].reset();
    this.todo.controls["STUCPHONE"].reset();
    this.todo.controls["Amount"].reset();
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

  checkType(_event) {
    if (this.type === "mohe") {
      this.todo.controls["SETNUMBER"].enable();
      this.todo.controls["STUCNAME"].disable();
      this.todo.controls["STUCPHONE"].disable();
    } else {
      this.todo.controls["SETNUMBER"].disable();
      this.todo.controls["STUCNAME"].enable();
      this.todo.controls["STUCPHONE"].enable();
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
      const request = {
        UUID: tranUuid,
        IPIN: this.serviceProvider.encrypt(tranUuid + form.IPIN),
        tranAmount: form.Amount,
        tranCurrency: "SDG",
        pan: form.mobilewallet ? null : form.Card.pan,
        expDate: form.mobilewallet ? null : form.Card.expDate,
        authenticationType: form.mobilewallet ? "10" : "00",
        entityType: form.mobilewallet ? "Mobile Wallet" : null,
        entityId: form.mobilewallet ? this.wallets[0].walletNumber : null,
        fromAccountType: "00",
        toAccountType: "00",
        paymentInfo:
          this.type === "moheArab"
            ? "STUCNAME=" +
              form.STUCNAME +
              "/STUCPHONE=" +
              form.STUCPHONE +
              "/STUDCOURSEID=" +
              form.CourseID.id +
              "/STUDFORMKIND=" +
              form.FormKind.id
            : "SETNUMBER=" +
              form.SETNUMBER +
              "/STUDCOURSEID=" +
              form.CourseID.id +
              "/STUDFORMKIND=" +
              form.FormKind.id,
        payeeId:
          this.type === "moheArab"
            ? "Higher Education Arab"
            : "Higher Education"
      };

      this.serviceProvider
        .doTransaction(request, "consumer/payment")
        .subscribe(res => {
          if (res != null && res.responseCode == 0) {
            const datetime = moment(res.tranDateTime, "DDMMyyHhmmss").format(
              "DD/MM/YYYY  hh:mm:ss"
            );
            const main = [{ HighEdu: res.tranAmount }];
            let data = [];

            if (res.PAN) {
              data.push({ Card: res.PAN });
            } else {
              data.push({ WalletNumber: res.entityId });
            }

            if (Object.keys(res.billInfo).length > 0) {
              if (this.type !== "moheArab") {
                res.billInfo.SETNUMBER = this.todo.controls["SETNUMBER"].value;
              }
              data.push(res.billInfo);
            }

            data.push({
              fees:
                this.calculateFees(res) !== 0 ? this.calculateFees(res) : null,
              date: datetime
            });

            let modal = this.modalCtrl.create(
              "TransactionDetailPage",
              { data: data, main: main },
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
