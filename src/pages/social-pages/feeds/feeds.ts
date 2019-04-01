import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Events
} from "ionic-angular";
import { Api } from "../../../providers/providers";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { StorageProvider } from "../../../providers/storage/storage";
import { AlertProvider } from "../../../providers/alert/alert";

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

  constructor(
    private photoViewer: PhotoViewer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public events: Events,
    public api: Api
  ) {
    this.alertProvider.showLoading();

    this.api.get("Fposts", "?page=0&size=5", null).subscribe(
      (res: any) => {
        if (res) {
          this.last = res.last;
          this.posts = res.content;
          this.alertProvider.hideLoading();
        }
      },
      err => {
        this.alertProvider.hideLoading();
        this.alertProvider.showAlert(err);
      }
    );

    events.subscribe("profile:updated", () => {
      this.api.get("Fposts", "?page=0&size=5", null).subscribe(
        (res: any) => {
          if (res) {
            this.last = res.last;
            this.posts = res.content;
          }
        },
        err => {
          this.alertProvider.showAlert(err);
        }
      );
    });
  }

  doRefresh(refresher) {
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
        this.alertProvider.showAlert(err);
      }
    );
  }

  like(post: any) {
    this.storageProvider.getProfile().subscribe(val => {
      let profileData = val;

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
            this.alertProvider.showToast("failedToLike");
          }
        );
    });
  }

  openOtherProfile(page: any, post: any) {
    this.navCtrl.push(page, { item: post.profile });
  }

  openPost(page: any, post: any) {
    this.navCtrl.push(page, { item: post });
  }

  viewImage(post: any) {
    this.photoViewer.show(
      this.api.url + "/postimage/" + post.id,
      post.postTxt,
      { share: true }
    );
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api.get("Fposts", "?page=" + this.page + "&size=5", null).subscribe(
      (res: any) => {
        if (res) {
          this.last = res.last;
          for (let i = 0; i < res.content.length; i++) {
            this.posts.push(res.content[i]);
          }
          infiniteScroll.complete();
        }
      },
      err => {}
    );
  }

  ionViewDidLoad() {}
}
