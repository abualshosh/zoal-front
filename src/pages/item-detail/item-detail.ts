import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Content } from "ionic-angular";
import { Api } from "../../providers/providers";
import { FormControl, FormBuilder } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-item-detail",
  templateUrl: "item-detail.html"
})
export class ItemDetailPage {
  post: any;
  commentTxt: any;
  public messageForm: any;
  @ViewChild(Content) contents: Content;
  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    navParams: NavParams,
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
    this.navCtrl.push(page, { item: post });
  }

  viewlikes(post: any) {
    var profileData: any = JSON.parse(localStorage.getItem("profile"));
    let seq = this.api
      .post("likesDTO", { profile: profileData.id, posts: post.id })
      .subscribe(
        (res: any) => {
          post.posttolikes.push(res);
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  send() {
    if (this.commentTxt.value) {
      var profileData: any = JSON.parse(localStorage.getItem("profile"));
      let seq = this.api
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
    }
  }
}
