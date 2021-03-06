import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Content
} from "ionic-angular";
import { Api } from "../../../providers/providers";
import { StorageProvider } from "../../../providers/storage/storage";
import { AlertProvider } from "../../../providers/alert/alert";
import * as moment from "moment";

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
  transactions = [];

  @ViewChild("content") content: Content;
  dateFilter: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public api: Api
  ) {    
    this.alertProvider.showLoading();
    this.api.get("profile-transactions", "?page=0&size=15", null).subscribe(
      (res: any) => {
        this.last = res.last;
        this.transactions = res.content;
        this.storageProvider.setTransactions(res).then(res => {});
      },
      err => {
        this.alertProvider.hideLoading();
        this.alertProvider.showToast("errorMessage");
        this.storageProvider.getTransactions().subscribe(res => {
          this.last = res.last;
          this.transactions = res.content;
        });
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  doRefresh(refresher) {
    this.api.get("profile-transactions", "?page=0&size=15", null).subscribe(
      (res: any) => {
        this.last = res.last;
        this.transactions = res.content;
        this.storageProvider.setTransactions(res).then(res => {});
        this.dateFilter = null;
        refresher.complete();
      },
      err => {
        console.error("ERROR", err);
        this.dateFilter = null;
        refresher.complete();
      }
    );
  }

  filterByDate() {
    this.alertProvider.showLoading();
    this.api.get("all-profile-transactions").subscribe(
      (res: any) => {
        this.filterTransactions(res);
      },
      err => {
        this.alertProvider.hideLoading();
        this.storageProvider.getTransactions().subscribe(res => {
          this.filterTransactions(res.content);
        });
        this.alertProvider.showToast("errorMessage");
      },
      () => {
        this.alertProvider.hideLoading();
      }
    );
  }

  filterTransactions(transactions) {
    this.dateFilter = moment(this.dateFilter, "YYYY-MM-DD").format("DDMMYY");
    this.transactions = transactions.filter(val => {
      let tranDate = moment(val.tranDateTime, "DDMMyyHhmmss").format("DDMMYY");
      return tranDate == this.dateFilter;
    });
  }

  parseTranType(type: string): string {
    let result: string = type.replace(/Consumer: |Gmpp: |IPINGeneration: /, "");
    return result.replace(/payment - |billInquiry - |specialPayment - /, "");
  }

  openTransaction(transaction) {
    let isSuccess;
    if (transaction.responseStatus === "Successful") {
      isSuccess = true;
    } else {
      isSuccess = false;
    }

    let response;
    if (transaction.ebsResponse) {
      response = JSON.parse(transaction.ebsResponse);
      
      
      let data = [];

      let mainData = {
        transactionType: this.parseTranType(transaction.type),
        tranAmount: transaction.tranAmount ? transaction.tranAmount : null
      };

      let balance = null;
      if (transaction.type == "Consumer: balanceInquiry" && response.balance) {
        balance = response.balance.available;
      }

      let bodyData = {
        date: moment(response.tranDateTime, "DDMMyyHhmmss").format(
          "DD/MM/YYYY  hh:mm:ss"
        ),
        Card: response.PAN,
        toCard: response.toCard,
        WalletNumber: response.entityId
          ? response.entityId
          : response.consumerIdentifier,
        voucherCode: response.voucherCode,

        balance: balance,
        
        comment: transaction.comment,

        serviceInfo: response.serviceInfo,
        fees:
          this.calculateFees(response) !== 0
            ? this.calculateFees(response)
            : null,

        destinationIdentifier: response.destinationIdentifier,
        availableBalance: response.availableBalance,
        reservedBalance: response.reservedBalance,
        tan: response.tan,
        fee: response.fee,
        externalFee: response.externalFee,
        transactionAmount: response.transactionAmount,
        totalAmount: response.totalAmount,
        transactionId: response.transactionId,
        paymentInfo: response.paymentInfo ? this.fixPaymentInfo(response.paymentInfo) : null
      };

      data.push(bodyData);

      if (response.billInfo) {
        if (Object.keys(response.billInfo).length > 0) {
          // Customs unneeded fields
          response.billInfo.Status = null;
          response.billInfo.ReceiptDate = null;
          response.billInfo.ReceiptSerial = null;
          response.billInfo.RegistrationSerial = null;
          response.billInfo.RegistrationSerial = null;
          response.billInfo.ProcStatus = null;
          response.billInfo.ProcError = null;

          //E15 unneeded fields
          response.billInfo.UnitName = null;
          response.billInfo.ServiceName = null;
          response.billInfo.TotalAmount = null;

          //NEC unneeded fields
          response.billInfo.opertorMessage = null;
          response.billInfo.accountNo = null;
          response.billInfo.netAmount = null;

          //MTN TopUp unneeded fields
          // response.billInfo.subNewBalance = null;

          if (response.billInfo.token) {
            response.billInfo.token = this.separateToken(response.billInfo.token)
          }
          if (response.billInfo.paymentInfo) {
            console.log(response.billInfo.paymentInfo);
            
          }

          data.push(response.billInfo);
        }
      }
      
      let modal = this.modalCtrl.create(
        "TransactionDetailPage",
        {
          data: data,
          main: mainData,
          isHistory: true,
          isSuccess: isSuccess
        },
        { cssClass: "inset-modal" }
      );
      modal.present();
    } else {
    }
  }
  
  separateToken(token:string) {
    let newToken = token.match(/.{1,4}/g);
    token =newToken.join("-")
    return token
  }
  
  fixPaymentInfo(paymentInfo: string) {
    if (paymentInfo.includes("MPHONE=")) {
      paymentInfo = paymentInfo.replace("MPHONE=","")
    } else if (paymentInfo.includes("METER="))
      paymentInfo = paymentInfo.replace("METER=", "")
    return paymentInfo;
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

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api
      .get("profile-transactions", "?page=" + this.page + "&size=15", null)
      .subscribe(
        (res: any) => {
          this.last = res.last;
          for (let i = 0; i < res.content.length; i++) {
            this.transactions.push(res.content[i]);
          }
          infiniteScroll.complete();
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  

}
