import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';

let langCode;
let langId;
let formData;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public breadcrumb: any; 
  public breadcrumbAr: any; 

  addForm: FormGroup;
  loader = false;
  submitted = false;

  arabic : boolean;

  constructor(private formBuilder: FormBuilder,private service: Constant , private router: Router
    ,private translate: TranslateService ,  private toastr: ToastrService , 
    private location: Location , private cd: ChangeDetectorRef) { 
      formData = new FormData();
      this.translateMethod()
    }


  ngOnInit() {
    
    this.breadcrumb = {
      'mainlabel': 'Add Delivery Option',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/deliveryOptions/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة خيار توصيل',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/deliveryOptions/list'
        },
    
      ]
    };


    this.addForm = this.formBuilder.group({
      name_en: ['',Validators.required ],
      name_ar: ['',Validators.required ] ,
      estimated_hours : ['',Validators.required ] ,
      type : ['',Validators.required ] ,
      cost : ['',Validators.required ] 
    });

    
  }
 
  
  get f() {
    return this.addForm.controls;
  }
  submit()
  {
    this.loader = true;

    var name_en =  this.f.name_en.value; 
    var name_ar = this.f.name_ar.value;
    var estimated_hours =  this.f.estimated_hours.value; 
    var cost = this.f.cost.value;
    var type = this.f.type.value;
  
    formData.append("name_en", name_en);    
    formData.append("name_ar", name_ar);
    formData.append("estimated_hours", estimated_hours);    
    formData.append("cost", cost);
    formData.append("type", type);

    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
   
    formData.forEach((value,key) => {
      console.log(key+value)
       });
    this.service.addDeliveryOption(formData).then(
      res=> {
      this.loader = false;
      this.toastr.success(this.translate.instant('msg.addDeliveryOption'))
      setTimeout(() => 
        {
          this.router.navigate(['/deliveryOptions/list']);
        },
        1000);
    },err => {
      this.loader = false;
      this.toastr.error(err)
    })


  }
 
  translateMethod(){
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    langCode = lang.split('"').join('');
    this.translate.use(langCode);
    let lang_id = localStorage.getItem("langId");
    langId = lang_id.split('"').join('');
    if (Number(langId) == 1){
      this.arabic = true;

    }else{
      this.arabic = false;
    }
  }

  cancel()
  {
    this.location.back();
  }

}
