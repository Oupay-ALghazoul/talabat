import { Inject, Injectable, ViewChild } from '@angular/core';
import { FirebaseApp } from "angularfire2";
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs'
import { User } from 'src/app/models/User';
import { Constant } from '../constant';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase/app';
import 'firebase/messaging';

@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  current_user;

  private customSubject = new Subject<any>();
  customObservable = this.customSubject.asObservable();

  private messaging: firebase.messaging.Messaging;

  constructor(

    private angularFireMessaging: AngularFireMessaging,
    public usersService: Constant ,
    @Inject(FirebaseApp) private _firebaseApp: firebase.app.App ,
    private toastr : ToastrService) {
    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // )
      this.messaging = firebase.messaging(this._firebaseApp);
  }

  // Service message commands update
  callComponentMethod(value:any) {
    console.log(value)
   this.customSubject.next(value);
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.pipe(mergeMapTo(this.angularFireMessaging.tokenChanges))
      .subscribe(
        (token) => {
          console.debug('Permission granted! Save to the server!', token);
          this.receiveMessage();
          console.log(token)
          this.getUserProfile(token) 
        },
        (err) => {
          console.error('Unable to get permission to notify.', err);
          this.getUserProfile(null) 
        }
      );
  }

  getUserProfile(firebase_token) {
    console.log(firebase_token)
    this.usersService.profile().then((res: User) => {
      console.log(res)
      const newItem: { [k: string]: any } = {}
      newItem.first_name = res.first_name;
      newItem.last_name = res.last_name;
      newItem.email = res.email;
      newItem.phone = res.phone;
      newItem.city_id = res.city_id;
      newItem.activated = res.activated;

      newItem.gender = res.gender;
      newItem.birth_date = res.birth_date == null ? '' : res.birth_date.substring(0, 10);
      newItem.locale = res.locale;
      newItem.firebase_token = firebase_token;
      newItem.image_quality = "High Quality"
      newItem.orders = 1;
      newItem.emails = 1;
      newItem.promotions = 1 ;
      newItem.others = 1 ;

      console.log(newItem)

      this.usersService.updateMyProfile(newItem).then(
        res => {
         console.log(res)
        }, err => {
          console.log(res)
        })
    },(err=>{
      console.log(err)
    }))
  }
  /**
   * hook method when new notification received in foreground
   */
   receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log(payload)
      this.currentMessage = new BehaviorSubject(null) ;
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
      this.currentMessage.subscribe(msg=>{
        this.toastr.info(msg?.notification?.body,msg?.notification?.title)
      })
      this.callComponentMethod(payload);

    });
  }
}