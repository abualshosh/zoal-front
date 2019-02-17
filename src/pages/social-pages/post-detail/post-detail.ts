import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Content } from "ionic-angular";
import { Api } from "../../../providers/providers";
import { FormControl, FormBuilder } from "@angular/forms";
import { StorageProvider } from "../../../providers/storage/storage";

@IonicPage()
@Component({
  selector: "page-post-detail",
  templateUrl: "post-detail.html"
})
export class PostDetailPage {
  post: any;
  commentTxt: any;
  public messageForm: any;
  @ViewChild(Content) contents: Content;

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    navParams: NavParams,
    public storageProvider: StorageProvider,
    public api: Api
  ) {
    this.post = navParams.get("item");
    this.messageForm = formBuilder.group({
      message: new FormControl("")
    });

    this.commentTxt = this.messageForm.controls["message"];
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.contents) {
        this.contents.scrollToBottom();
      }
    }, 500);
  }

  openOtherProfile(page: any, post: any) {
    this.navCtrl.push(page, { item: post.profile });
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
            console.error("ERROR", err);
          }
        );
    });
  }

  send() {
    if (this.commentTxt.value) {
      this.storageProvider.getProfile().subscribe(val => {
        let profileData = val;

        this.api
          .post("comments", {
            profile: profileData.id,
            posttocomment: this.post.id,
            commentTxt: this.commentTxt.value
          })
          .subscribe(
            (res: any) => {
              this.post.posttocomments.push(res);
              this.scrollToBottom();
              this.commentTxt.reset();
            },
            err => {
              console.error("ERROR", err);
              this.commentTxt.reset();
            }
          );
      });
    }
  }
}
