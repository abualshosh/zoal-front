import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/providers'
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the FeedsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feeds',
  templateUrl: 'feeds.html',
})
export class FeedsPage {
last:boolean=false;
size:any;
page:any=0;
  posts = [];
  postsTest= [];

  constructor(private photoViewer: PhotoViewer,public navCtrl: NavController, public navParams: NavParams
  ,public api:Api) {
    let seq = this.api.get('Fposts',"?page=0&size=5",null).subscribe((res:any) => {
      if (res) {
       this.last=res.last;
        console.log(this.size)
        this.posts=res.content;
       } else {
        this.posts=this.postsTest;
      }
    }, err => {
      this.posts=this.postsTest;
      console.error('ERROR', err);
      });
  }   

  doRefresh(refresher) {
      console.log('Begin async operation', refresher);
      let seq = this.api.get('Fposts',"?page=0&size=5",null).subscribe((res:any) => {
      if (res) {
          this.last=res.last;
          this.posts=res.content;
          this.page=0;
          refresher.complete();
      } else {
          refresher.complete();
      }
      }, err => {
          refresher.complete();
          console.error('ERROR', err);
      });

    }

    like(post:any){

     var profileData:any=JSON.parse(localStorage.getItem('profile'));
      let seq = this.api.post('likesDTO',{profile:profileData.id,posts:post.id}).subscribe((res:any) => {
        post.posttolikes.push(res);
       

      }, err => {
    
    console.error('ERROR', err);
  });
    }
openOtherProfile(page:any,post:any){
  this.navCtrl.push(page,{item:post});
}
viewImage(post:any){
  this.photoViewer.show(this.api.url+'/postimage/'+post.id, post.postTxt, {share: true});
}
doInfinite(infiniteScroll){
this.page=this.page+1;
  let seq = this.api.get('Fposts',"?page="+this.page+"&size=5",null).subscribe((res:any) => {
  if (res) {
this.last=res.last;
      console.log(this.size);
      for(let i=0; i<res.content.length; i++) {
            this.posts.push(res.content[i]);
          }
           infiniteScroll.complete();
          } else {
      this.posts=this.postsTest;
    }
  }, err => {
     this.posts=this.postsTest;

    console.error('ERROR', err);
  });


}
  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedsPage');
  }

}
