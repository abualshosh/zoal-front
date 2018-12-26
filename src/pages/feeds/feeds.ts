import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { Api } from "../../providers/providers";
import { PhotoViewer } from "@ionic-native/photo-viewer";

/**
 * Generated class for the FeedsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-feeds",
  templateUrl: "feeds.html"
})
export class FeedsPage {
  last: boolean = false;
  size: any;
  page: any = 0;
  posts = [];
  postsTest = [];

  constructor(
    private photoViewer: PhotoViewer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public api: Api
  ) {
    let loading = this.loadingCtrl.create({
      content: "Getting posts..."
    });
    loading.present();
    this.api.get("Fposts", "?page=0&size=5", null).subscribe(
      (res: any) => {
        if (res) {
          this.last = res.last;
          this.posts = res.content;
          loading.dismiss();
        } else {
          this.posts = this.postsTest;
          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        }
      },
      err => {
        this.posts = this.postsTest;
        setTimeout(() => {
          loading.dismiss();
        }, 3000);

        if (!this.posts.length) {
          this.showAlert("no posts available");
        } else {
          this.showAlert(err);
        }
        console.error("ERROR", err);
      }
    );
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.api.get("Fposts", "?page=0&size=5", null).subscribe(
      (res: any) => {
        if (res) {
          this.last = res.last;
          this.posts = res.content;
          this.page = 0;
          refresher.complete();
        } else {
          refresher.complete();
        }
      },
      err => {
        refresher.complete();
        this.showAlert(err);
        console.error("ERROR", err);
      }
    );
  }

  like(post: any) {
    var profileData: any = JSON.parse(localStorage.getItem("profile"));
    this.api
      .post(
        "likesDTO",
        { profile: profileData.id, posts: post.id },
        { observe: "response" }
      )
      .subscribe(
        (res: any) => {
          if (res.status === 201) {
            post.posttolikes.push(res);
          } else if (res.status === 202) {
            post.posttolikes.pop(res);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  openOtherProfile(page: any, post: any) {
    this.navCtrl.push(page, { item: post });
  }

  viewImage(post: any) {
    this.photoViewer.show(
      this.api.url + "/postimage/" + post.id,
      post.postTxt,
      { share: true }
    );
  }

  showAlert(data: any) {
    let message: any;
    if (data.responseCode != null) {
      message = data.responseMessage;
    } else {
      message = "Connection error";
    }
    let alert = this.alertCtrl.create({
      title: "ERROR",
      message: message,

      buttons: ["OK"],
      cssClass: "alertCustomCss"
    });
    alert.present();
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api.get("Fposts", "?page=" + this.page + "&size=5", null).subscribe(
      (res: any) => {
        if (res) {
          this.last = res.last;
          //console.log(this.size);
          for (let i = 0; i < res.content.length; i++) {
            this.posts.push(res.content[i]);
          }
          infiniteScroll.complete();
        } else {
          this.posts = this.postsTest;
        }
      },
      err => {
        this.posts = this.postsTest;

        console.error("ERROR", err);
      }
    );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FeedsPage');
  }
}
