import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Api } from '../../providers/providers'

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];
contactlist:any=[];
username:any;
upcontacts:any=[];
  constructor(public api:Api,private contacts: Contacts,public navCtrl: NavController, public navParams: NavParams, public items: Items) {
this.username=localStorage.getItem('username');
  // this.currentItems=JSON.parse(localStorage.getItem("connections"));
   var dummy={"fullName":"Test","userName":"922190200"};
   this.currentItems.push(dummy);    
   this.currentItems.push(dummy);   
   this.currentItems.push(dummy);   
   this.currentItems.push(dummy);   
//
//this.currentItems= this.items.query();
   }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = JSON.parse(localStorage.getItem("connections"));
      return;
    }
    this.currentItems = this.currentItems.filter((v) => {
      
          if (v.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
             return true;
            }
      
            return false;
          });
  }
uploadContacts(){
  var opts = {
         //  filter : "M",
           multiple: true,
           hasPhoneNumber:true
         };

         this.contacts.find([ '*' ],opts).then((contacts) => {
           alert(contacts.length);
           for(var i=0;i<contacts.length;i++){
             let cont=contacts[i].phoneNumbers[0].value;
            contacts[i].phoneNumbers[0].value= cont.replace(/ /g,'').replace(')','').replace('-','').trim().slice(-9);
            if (!isNaN(+contacts[i].phoneNumbers[0].value)){
              this.upcontacts.push({"login":contacts[i].phoneNumbers[0].value});
            }
            
          }



          let seq = this.api.post('connections',this.upcontacts).share();
      //    this.posts=this.postsTest;
           seq.subscribe((res: any) => {
             // If the API returned a successful response, mark the user as logged in
             if (res) {
               console.log(this.username)

               console.log(res)
this.currentItems=[];
               for (var i=0;i<res.length;i++){
                 if(res[i].profileOne.userName!=this.username){
                    this.currentItems.push(res[i].profileOne);
                 }else if(res[i].profileTow.userName!=this.username){
                   this.currentItems.push(res[i].profileTow);
                 }
               }
              // this.currentItems=res;
                   localStorage.setItem("connections", JSON.stringify(this.currentItems));
             //  this._loggedIn(res);
           //  localStorage.setItem('id_token', res.id_token);
           //  console.log( localStorage.getItem('id_token'));

             } else {

             //  this.currentItems=this.postsTest;
             }
           }, err => {
           //  this.posts=this.postsTest;

             console.error('ERROR', err);
           });


          // this.contactlist=contacts;
         }, (error) => {
           console.log(error);
         });
}
  /**
   * Navigate to the detail page for this item.
   */
  openItem(item:any) {
    if(item.profileTow.userName!=this.username){
    item=item.profileTow;
    }else{
    item=item.profileOne;
    }

    this.navCtrl.push('OtherProfilePage', {
      item: item
    });
  }

}
