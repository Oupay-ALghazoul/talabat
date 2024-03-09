import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import {Location} from '@angular/common';

let langCode;
let langId;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class PlatformComponent implements OnInit {
  public breadcrumb: any; 
  public breadcrumbAr : any;

  arabic : boolean;

  submitted = false;
  editForm: FormGroup;

  loader=true;
  loaderBtn = false;
  
  constructor(
    private formBuilder: FormBuilder, 
    private service: Constant,
    private location: Location ,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
    this.translateMethod();
    this.service.getPlatformSettings().then(
      (data : any)=> {
      this.loader = false;
      this.editForm = this.formBuilder.group({
        users_verification: [data.users_verification  , Validators.required],
      })
    })
  }
  translateMethod(){
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
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
  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Edit Platform Settings'  
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل اعدادات المنصة'   
    };
  }
  get f() {
    return this.editForm.controls;
  }
 
  onSubmit() {
    this.loaderBtn = true;
    var users_verification =  this.f.users_verification.value; 
  
    const newItem  : {[k: string]: any} = {} ;
    
    newItem.users_verification = users_verification == true ? 1 : 0;
  
    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
  
    this.service.updatePlatformSettings(newItem).then(
      res=> {
      this.loaderBtn = false;
      this.toastr.success(this.translate.instant('msg.editAbout'));
    },err => {
      this.toastr.error(err);
      this.loaderBtn = false;
    })
  }
  cancel()
  {
    this.location.back();
  }
}
