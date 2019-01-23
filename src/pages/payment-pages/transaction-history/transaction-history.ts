import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Content
} from "ionic-angular";
import { Api } from "../../../providers/providers";

@IonicPage()
@Component({
  selector: "page-transaction-history",
  templateUrl: "transaction-history.html"
})
export class TransactionHistoryPage {
  last: boolean = false;
  showSearchbar: boolean = false;
  size: any;
  page: any = 0;
  history = [];

  @ViewChild("content") content: Content;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public api: Api
  ) {
    this.api.get("historiesmobile", "?page=0&size=15", null).subscribe(
      (res: any) => {
        this.last = res.last;
        //console.log(this.size)
        this.history = res.content;
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  doRefresh(refresher) {
    this.api.get("historiesmobile", "?page=0&size=15", null).subscribe(
      (res: any) => {
        this.last = res.last;
        //console.log(this.size)
        this.history = res.content;
        refresher.complete();
      },
      err => {
        console.error("ERROR", err);
        refresher.complete();
      }
    );
  }

  itemSelected(transaction) {
    var data = transaction.detailes;

    data = JSON.parse(data.substr(data.indexOf("response    ") + 12));
    var datas;
    if (data.balance) {
      datas = {
        destinationIdentifier: data.destinationIdentifier,
        toCard: data.toCard,
        tan: data.tan,
        fee: data.fee,
        transactionAmount: data.transactionAmount,
        totalAmount: data.totalAmount,
        acqTranFee: data.acqTranFee,
        issuerTranFee: data.issuerTranFee,
        tranAmount: data.tranAmount,
        tranCurrency: data.tranCurrency,
        //  ,"balance":data.balance.available
        transactionId: data.transactionId,
        date: transaction.transactionDate
      };
    } else {
      datas = {
        destinationIdentifier: data.destinationIdentifier,
        toCard: data.toCard,
        tan: data.tan,
        fee: data.fee,
        transactionAmount: data.transactionAmount,
        totalAmount: data.totalAmount,
        acqTranFee: data.acqTranFee,
        issuerTranFee: data.issuerTranFee,
        tranAmount: data.tranAmount,
        tranCurrency: data.tranCurrency,
        transactionId: data.transactionId,
        date: transaction.transactionDate
      };
    }

    var dat = [];
    if (data.PAN) {
      dat.push({ Card: data.PAN });
    } else {
      data.entityId
        ? dat.push({ WalletNumber: data.entityId })
        : dat.push({ WalletNumber: data.consumerIdentifier });
    }

    if (data.billInfo) {
      if (Object.keys(data.billInfo).length > 0) {
        if (data.billInfo.accountNo) {
          data.billInfo.accountNo = null;
        }
        if (data.billInfo.opertorMessage) {
          data.billInfo.opertorMessage = null;
        }

        dat.push(data.billInfo);
      }
    }

    var voucher = {
      //   "voucherNumber":data.voucherNumber
      //  ,
      voucherCode: data.voucherCode
    };
    var main = [];
    var mainData = {};

    mainData[transaction.transactionType] = data.totalAmount
      ? data.totalAmount
      : data.tranAmount;
    if (!mainData[transaction.transactionType]) {
      mainData[transaction.transactionType] = data.transactionAmount;
    }
    main.push(mainData);
    dat.push(voucher);
    dat.push(datas);

    let modal = this.modalCtrl.create(
      "TransactionDetailPage",
      { data: dat, main: main },
      { cssClass: "inset-modal" }
    );
    modal.present();
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api
      .get("historiesmobile", "?page=" + this.page + "&size=15", null)
      .subscribe(
        (res: any) => {
          this.last = res.last;
          //console.log(this.size);
          for (let i = 0; i < res.content.length; i++) {
            this.history.push(res.content[i]);
          }
          infiniteScroll.complete();
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }
}
