import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, OnDestroy , Input} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';

let langCode;
let langId;
let formData;
let photo ;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit , OnDestroy {
  pageLoader : boolean = true ;
 
  public breadcrumb: any; 
  public breadcrumbAr: any; 

  addForm: FormGroup;
  loader = false;
  submitted = false;

  arabic : boolean;
  categories : any [] ;

  @Input() item ;

  constructor(private formBuilder: FormBuilder,private service: Constant , private router: Router
    ,private translate: TranslateService ,  private toastr: ToastrService , 
    private location: Location ) { 
      formData = new FormData();
      this.translateMethod();
      this.init()
    }

  ngOnInit() {
    photo = null ;
    this.breadcrumb = {
      'mainlabel': 'Add Product Category',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/categories/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة  تصنيف منتجات',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/categories/list'
        },
    
      ]
    };
   
  }
  init(){
    setTimeout(() => 
    {
      this.categories = JSON.parse(localStorage.getItem("all_categories"))
      console.log(this.categories )
      console.log("invoce init")
      this.addForm = this.formBuilder.group({
        name_en: ['',Validators.required ],
        name_ar: ['',Validators.required ], 
        description_ar: ['',Validators.required ], 
        description_en: ['',Validators.required ], 
        product_category_id : [ this.item == '' ? "" : this.item] ,
        you_may_like  : [false,Validators.required ], 
        special :  [false,Validators.required ], 
        photo: ['']
      });
      this.pageLoader = false
    },
    3000); 
  }
  param() {
   
  }
  previewUrl:any = null;
  fileData: File = null;
  reader = new FileReader();

  upload(files: File[]){ 
    this.fileData = files[0];
    this.reader.readAsDataURL(this.fileData);
    
    this.reader.onload = function(){ 
     photo = this.result;
     
      };   
 
      this.preview()
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
      
      (<HTMLInputElement>document.getElementById("imageReview")).style.display = "block";
      (<HTMLInputElement>document.getElementById("imageReview")).src =   this.previewUrl;
    }
  }
  get f() {
    return this.addForm.controls;
  }
  submit()
  {
    this.loader = true;

    var name_en =  this.f.name_en.value; 
    var name_ar = this.f.name_ar.value;
    var description_en = this.f.description_en.value;
    var description_ar = this.f.description_ar.value ;
    var product_category_id = this.f.product_category_id.value;
    var you_may_like = this.f.you_may_like.value;
    var special = this.f.special.value;
  
    const newItem  : {[k: string]: any} = {}

    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.activated =  "1";

    newItem.description_en = description_en;
    newItem.description_ar = description_ar ;
    newItem.product_category_id = product_category_id ;
    newItem.you_may_like = you_may_like == true ? 1 : 0;
    newItem.special = special == true ? 1 : 0 ;
    newItem.image =  photo

    console.log(this.item)
    
    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
    
    if(photo == null )
    {
       this.toastr.warning(this.translate.instant('msg.uploadPhoto'))
       this.loader = false;
       return;
    }
    console.log(newItem)
    this.service.addCategory(newItem).then(
      res=> {
      this.loader = false;
      photo = null ;
      this.toastr.success(this.translate.instant('msg.addCategory'))
      setTimeout(() => 
        {
          this.router.navigate(['/setting/home']);
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
  ngOnDestroy() {
    photo = null;
  }
}
