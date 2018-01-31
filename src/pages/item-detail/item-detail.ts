import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content } from 'ionic-angular';
import { Api } from '../../providers/providers'
import { FormControl, FormBuilder } from '@angular/forms';


import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  post: any;
      chatBox: any;
  public messageForm: any;
    @ViewChild(Content) contents: Content;
  constructor(public formBuilder: FormBuilder,public navCtrl: NavController, navParams: NavParams, items: Items,public api:Api) {
    this.post = navParams.get('item') || items.defaultItem;
     this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = '';
  }
    
      scrollToBottom() {
    setTimeout(() => {
if(this.contents){
      this.contents.scrollToBottom();
  }}, 500);
  }
  like(post:any){
    
         var profileData:any=JSON.parse(localStorage.getItem('profile'));
          let seq = this.api.post('likesDTO',{profile:profileData.id,posts:post.id}).subscribe((res:any) => {
            post.posttolikes.push(res);
           
    
          }, err => {
        
        console.error('ERROR', err);
      });
        }
  send(newpost){
    var profileData:any=JSON.parse(localStorage.getItem('profile')); 
    let seq = this.api.post('comments',{profile:profileData.id,posttocomment:this.post.id,commentTxt:newpost}).subscribe((res:any) => {
      this.post.posttocomments.push(res);
      this.scrollToBottom();
      
    }, err => {
  
  console.error('ERROR', err);
});
 
  }
}
