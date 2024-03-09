import { Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { Category } from 'src/app/models/Category'

let langCode;
let langId;
let photo;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit  , OnDestroy{

  
  public breadcrumb: any; 
  public breadcrumbAr : any;

  arabic : boolean;

  submitted = false;
  editForm: FormGroup;

  loader=true;
  loaderBtn = false;
  category : Category;

  cat_id
  categories
  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.cat_id =  this.route.snapshot.params['id'];
      console.log(this.cat_id)
      this.service.getCategoryById(this.cat_id).then(
        (data : Category)=> {
        this.loader = false;
        this.category = data;
        console.log(data);
        this.categories = JSON.parse(localStorage.getItem("all_categories"))
        this.editForm = this.formBuilder.group({
          name_en: [this.category.name_en , Validators.required],
          name_ar: [this.category.name_ar , Validators.required], 
          activated : [ this.category.activated == true ? "1" : "0", Validators.required ] ,
          description_ar: [ this.category.description_ar,Validators.required ], 
          description_en: [  this.category.description_en ,Validators.required ], 
          product_category_id : [ this.category.product_category_id] ,
          you_may_like  : [this.category.you_may_like  ,Validators.required ], 
          special :  [this.category.special  ,Validators.required ], 
          photo: ['']
        });
    
      })
  }

  ngOnInit() {
    photo = null;
    this.breadcrumb = {
      'mainlabel': 'Edit Product Category',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/categories/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل تصنيف منتجات',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/categories/list'
        },
    
      ]
    };
  }
  get f() {
    return this.editForm.controls;
  }
  submit()
  {
    this.loaderBtn = true   
    var name_en =  this.f.name_en.value; 
    var name_ar = this.f.name_ar.value;
    var activated = this.f.activated.value;
    var description_en = this.f.description_en.value;
    var description_ar = this.f.description_ar.value ;
    var product_category_id = this.f.product_category_id.value;
    var you_may_like = this.f.you_may_like.value;
    var special = this.f.special.value;

    const newItem  : {[k: string]: any} = {}

    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.activated = activated;

    newItem.description_en = description_en;
    newItem.description_ar = description_ar ;
    newItem.product_category_id = product_category_id ;
    newItem.you_may_like = you_may_like == true ? 1 : 0;
    newItem.special = special == true ? 1 : 0 ;
      
    if(photo !=  null )
      newItem.image = photo

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
     
    console.log(newItem)
    this.service.updateCategory( this.category.id, newItem).then(
      res=> {
      this.loaderBtn = false  ;
      photo = null ; 
      this.toastr.success(this.translate.instant('msg.editCategory'))
      setTimeout(() => 
        {
          this.router.navigate(['/categories/list']);
        },
        1000);
    },err => {
      this.loaderBtn = false   
      this.toastr.error(err)
    })


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
    (<HTMLInputElement>document.getElementById("imageReview")).src =   this.previewUrl;
    }
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
  cancel()
  {
    this.location.back();
  }
  ngOnDestroy() {
    photo = null;
  }
 
}
