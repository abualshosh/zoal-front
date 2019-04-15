import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Content } from "ionic-angular";
import { Api } from "../../../providers/providers";
import { FormControl, FormBuilder } from "@angular/forms";
import { StorageProvider } from "../../../providers/storage/storage";
import { AlertProvider } from "../../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-post-detail",
  templateUrl: "post-detail.html"
})
export class PostDetailPage {
  post: any;
  likes: any;
  comments: any;
  commentTxt: any;
  public messageForm: any;
  @ViewChild(Content) contents: Content;

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    navParams: NavParams,
    public storageProvider: StorageProvider,
    public alertProvider: AlertProvider,
    public api: Api
  ) {
    this.post = navParams.get("item");
    this.messageForm = formBuilder.group({
      message: new FormControl("")
    });

    this.commentTxt = this.messageForm.controls["message"];

    this.api.get("post-likes/" + this.post.id).subscribe(res => {
      this.likes = res;
    });

    this.api.get("post-comments/" + this.post.id).subscribe(res => {
      this.comments = res;
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.contents) {
        this.contents.scrollToBottom();
      }
    }, 500);
  }

  openProfile(profile: any) {
    this.navCtrl.push("ProfilePage", { item: profile });
  }

  like(post: any) {
    let request = {
      profileId: localStorage.getItem("profileId"),
      postId: post.id
    };
    this.api.post("post-likes", request).subscribe(
      (res: any) => {
        if (res) {
          this.likes.push(res);
        } else {
          this.likes.pop();
        }
      },
      err => {
        this.alertProvider.showToast("failedToLike");
      }
    );
  }

  send() {
    if (this.commentTxt.value) {
      this.api
        .post("post-comments", {
          profile: { id: localStorage.getItem("profileId") },
          post: { id: this.post.id },
          content: this.commentTxt.value
        })
        .subscribe(
          (res: any) => {
            this.comments.push(res);
            this.scrollToBottom();
            this.commentTxt.reset();
          },
          err => {
            console.error("ERROR", err);
            this.commentTxt.reset();
          }
        );
    }
  }
}
