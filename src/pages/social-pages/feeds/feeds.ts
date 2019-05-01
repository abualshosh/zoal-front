import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Events
} from "ionic-angular";
import { Api } from "../../../providers/providers";
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
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public events: Events,
    public api: Api
  ) {}

  ionViewWillEnter() {
    this.loadPosts();
    this.events.subscribe("profile:updated", () => {
      this.loadPosts();
    });
  }

  loadPosts() {
    this.alertProvider.showLoading();
    this.api.get("contacts-posts", "?page=0&size=5", null).subscribe(
      (res: any) => {
        this.alertProvider.hideLoading();
        if (res) {
          this.last = res.last;
          this.posts = res.content;
        }
      },
      err => {
        this.alertProvider.hideLoading();
        this.alertProvider.showAlert(err);
      }
    );
  }

  doRefresh(refresher) {
    this.api.get("contacts-posts", "?page=0&size=5", null).subscribe(
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
    let request = {
      profileId: localStorage.getItem("profileId"),
      postId: post.id
    };
    this.api.post("post-likes", request).subscribe(
      (res: any) => {
        if (res) {
          post.likes.push(res);
        } else {
          post.likes.pop(res);
        }
      },
      err => {
        this.alertProvider.showToast("failedToLike");
      }
    );
  }

  openProfile(post: any) {
    this.navCtrl.push("ProfilePage", { item: post.profile });
  }

  openPost(post: any) {
    this.navCtrl.push("PostDetailPage", { item: post });
  }

  createPost() {
    this.navCtrl.push("PostCreatePage");
  }

  doInfinite(infiniteScroll) {
    this.page = this.page + 1;
    this.api
      .get("contacts-posts", "?page=" + this.page + "&size=5", null)
      .subscribe(
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
}
