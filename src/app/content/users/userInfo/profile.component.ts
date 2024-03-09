import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TranslateService } from '@ngx-translate/core';
import { Constant } from 'src/app/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from 'src/app/_services/user-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

let langCode;
let langId;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class UserInfoComponent implements OnInit {
  @BlockUI('postForm') blockUIProjectInfo: NgBlockUI;
  
  breadcrumb:any;
  breadcrumbAr : any;
  loader=true;
  fname;
  lname;
  mobile;
  email;
  birthday;
  arabic : boolean = false;
  param_id;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;
  constructor(private translate: TranslateService , private service : Constant , private user: UserServiceService ,
    private route: ActivatedRoute , private formBuilder: FormBuilder  ,  private toastr: ToastrService , private router: Router
    ) {
    this.param_id = this.route.snapshot.params['id'];
    this.getUserProfile();
    this.translateMethod()
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_user")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showEdit = true;
    }
   }

  ngOnInit() {
    
    this.breadcrumb = {
      'mainlabel': 'Customer Info',
      'links': [
        {
          'name': 'Customers List',
          'isLink': true,
          'link': '/users/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'معلومات العميل' ,
      'links': [
        {
          'name': 'قائمة العملاء',
          'isLink': true,
          'link': '/users/list'
        },
    
      ]
    };
   
 
  }

  info;
  name;
  photo = '';
  city;
  country;
  timezone;
  activated ;
  locale;
  role
  gender
  userInfo : FormGroup
  submitted = false;

  getUserProfile(){
    console.log(this.param_id)
    this.service.viewUserProfile(this.param_id).then(
      (res : User)=> {
        this.loader=false;
        console.log(res)
       this.info  = res
        this.name = res.full_name;
        this.mobile = res.phone;
        this.email = res.email;
        // this.photo = res.photo;
        this.city = res.city.id;
        this.country = res.city.country_id
        this.timezone = res.timezone;
        this.activated = res.activated ;
        this.locale = res.locale
        this.role= res.role
        this.userInfo = this.formBuilder.group({      
          email :  [res.email , [Validators.required, Validators.email]] ,
          activated : [ res.activated == true && res.activated != null  ? "1" : "0", Validators.required ] 
        })
        console.log(  this.f.activated.value)
    })
    
  }
 
  get f() {
    return this.userInfo.controls;
  }
  loaderBtn : boolean = false
  onSubmit(){
    this.loaderBtn = true
    // console.log(event)
    const newItem = {
      "activated" : '' ,
      "full_name" : "" ,
      "email" : "" ,
      "phone" : "" ,
      "city_id" : "" , 
      "timezone" : "" , 
      "photo" : "" ,
      "role" : "" ,
      "locale" : "" ,
    }
    newItem.activated =   this.f.activated.value
    newItem.full_name =  this.name ;
    newItem.email =  this.f.email.value ;
    newItem.phone = this.mobile
    newItem.city_id = this.city.id
    newItem.timezone = this.timezone;
    newItem.photo =  this.photo 
    newItem.role = this.info.role;
    newItem.locale = this.info.locale

    console.log(newItem)
    this.submitted = true;
    if (this.userInfo.invalid) {
      this.loaderBtn = false;
      return;
    }
    // this.service.activateUser( this.param_id , newItem).then(
    //   res=> {
    //   this.loaderBtn = false   
    //   if(langCode  == 'ar'){
    //     this.toastr.success( "تم تعديل معلومات العميل بنجاح");
    //   }else{
    //     this.toastr.success( "Customer Edited successfuly");
    //   }
    //   setTimeout(() => 
    //     {
    //       this.router.navigate(['/users/list']);
    //     },
    //     1000);
    // },err => {
    //   this.loaderBtn = false   
    //   this.toastr.error(err)
    // })
  }

  translateMethod(){
    this.translate.setDefaultLang('en');
    this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    langCode = lang.split('"').join('');
    this.translate.use(langCode);
    console.log(langCode)
    let lang_id = localStorage.getItem("langId");
    langId = lang_id.split('"').join('');
    if (Number(langId) == 1){
      this.arabic = true;

    }else{
      this.arabic = false;
    }
  }

}
