import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { MessagingService } from 'src/app/shared/messaging.service';

let  langId;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class EditAdminPassComponent implements OnInit {
  breadcrumb:any;
  breadcrumbAr : any;


  arabic : boolean;
  langCode : string ;

  loader : boolean = true;

  userPass: FormGroup; 

  hide: boolean = true;
  hideOld : boolean = true ;

  submitted = false;
  loaderBtn : boolean = false;
    
  constructor(private formBuilder: FormBuilder,  private location: Location ,
    private translate: TranslateService, private service : Constant ,
    private toastr: ToastrService  ,  private router: Router , private messagingService: MessagingService ) {
 
    this.translateMethod();
   }

  myFunction() {
    this.hide = !this.hide;
  }
  myFunctionOld() {
    this.hideOld = !this.hideOld;
  }
  ngOnInit() {
    
    this.breadcrumb = {
      'mainlabel': 'Edit Admin Password'  
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل كلمة السر'   
    };
   
    this.userPass = this.formBuilder.group({      
      oldPass :['',Validators.required ],
      newPass:['', [Validators.required , Validators.minLength(8)]]
    
    });

  }
  get f() {
    return this.userPass.controls;
  }
 
  onSubmit() {
    this.loaderBtn = true;
    var oldPass =  this.f.oldPass.value; 
    var newPass =  this.f.newPass.value; 
    const newItem = {
      "current_password":"",
      "new_password":""
    }
    newItem.current_password = oldPass;
    newItem.new_password = newPass

    this.submitted = true;
    if (this.userPass.invalid) {
      this.loaderBtn = false;
      return;
    }
  
    this.service.resetPassword(newItem).then(
      res=> {
      this.loaderBtn = false;
      this.toastr.success(this.translate.instant('msg.editAbout'));
        this.logout()
    },err => {
      this.toastr.error(err);
      this.loaderBtn = false;
    })
  }
  cancel()
  {
    this.location.back();
  }

  logout() {
    this.messagingService.getUserProfile(null);
    if (localStorage.getItem('adminTalabat')) {
      this.service.logout().then(res => {
        this.service.clearUserObject()
        // window.location.href = '/login';
        localStorage.removeItem('permission-talabate')
        localStorage.removeItem('remember')
        this.router.navigate(['/']);
      }, err => {
        console.log(err);
      });
    }
  }

  translateMethod(){
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    this.langCode = lang.split('"').join('');
    this.translate.use(this.langCode);
    // console.log(langCode)
    let lang_id = localStorage.getItem("langId");
    langId = lang_id.split('"').join('');
    if (Number(langId) == 1){
      this.arabic = true;
    }else{
      this.arabic = false;
    }
  }
}
