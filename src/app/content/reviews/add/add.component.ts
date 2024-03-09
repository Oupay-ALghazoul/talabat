import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product'
import { User } from 'src/app/models/User';

let langCode;
let langId;
let formData;
let photo

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

 
  public breadcrumb: any; 
  public breadcrumbAr: any; 

  addForm: FormGroup;
  loader = true;
  loaderBtn = false ;
  submitted = false;

  arabic : boolean;

  max: number = 5;
  public rate: number = 2;
  isReadonly: boolean = false;
  public overStar: number =2;
  percent

  products : Product [] ;
  users : User [] ;

  constructor(private formBuilder: FormBuilder,private service: Constant , private router: Router
    ,private translate: TranslateService ,  private toastr: ToastrService , 
    private location: Location , private cd: ChangeDetectorRef) { 
      formData = new FormData();
      this.translateMethod() ;
      console.log("logggggggggggggggggggggggggggggggg")
      this.service.getAllProductsMenu().then((data : any) =>{
        this.products = data;
        this.service.getAllUsersMenu().then((data : any) =>{
          this.users = data;
        })
        this.loader = false ;
      })    
    }


  ngOnInit() {
    
    this.breadcrumb = {
      'mainlabel': 'Add Review',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/reviews/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة تقييم',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/reviews/list'
        },
    
      ]
    };


    this.addForm = this.formBuilder.group({
      title: ['',Validators.required ],
      comment: ['',Validators.required ] ,
      product_id  : ['',Validators.required ] ,
      user_id : ['',Validators.required ] 
    });

    
  }
  hoveringOver(value: number): void {
    this.overStar = value + 1;  
    this.percent = (value / this.max) * 100;
  }
 
  resetStar(): void {   
    this.rate =  this.overStar;
  }
  
  get f() {
    return this.addForm.controls;
  }
  submit()
  {
    this.loaderBtn = true;
    console.log(this.rate)

    var title =  this.f.title.value; 
    var comment = this.f.comment.value;
    var product_id = this.f.product_id.value;
    var user_id  = this.f.user_id.value;
  
    formData.append("title", title);    
    formData.append("comment", comment);
    formData.append("product_id", product_id);
    formData.append("user_id", user_id);
    // if(this.overStar != null)
    formData.append("rating",  this.overStar.toString());
    
    this.submitted = true;
    if (this.addForm.invalid) {
      this.loaderBtn = false;
      return;
    }
   
    formData.forEach((value,key) => {
      console.log(key+value)
       });
    this.service.addReview(formData).then(
      res=> {
      this.loaderBtn = false;
      this.toastr.success(this.translate.instant('msg.addReview'))
      setTimeout(() => 
        {
          this.router.navigate(['/reviews/list']);
        },
        1000);
    },err => {
      this.loaderBtn = false;
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
