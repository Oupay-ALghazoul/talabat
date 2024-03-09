import { Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { QuillEditorComponent } from 'ngx-quill';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { Brand } from 'src/app/models/Brand'

let langCode;
let langId;
let photo;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit , OnDestroy{

  
  public breadcrumb: any; 
  public breadcrumbAr : any;

  arabic : boolean;

  submitted = false;
  editForm: FormGroup;

  loader=true;
  loaderBtn = false;
  brand : Brand;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.service.getBrandById(this.route.snapshot.params['id']).then(
        (data : Brand)=> {
        this.loader = false;
        this.brand = data;
        console.log(data);
        this.editForm = this.formBuilder.group({
          name_en: [this.brand.name_en , Validators.required],
          name_ar: [this.brand.name_ar , Validators.required], 
          activated : [ this.brand.activated == true ? "1" : "0", Validators.required ] ,
          special : [ this.brand.special ,Validators.required ], 
          sort : [ this.brand.sort , [Validators.required , Validators.min(0)] ] ,
          image: []
        });
    
      })
  }
  ngOnDestroy() {
    photo = null;
  } 
  ngOnInit() {
    photo = null;
    this.breadcrumb = {
      'mainlabel': 'Edit Brand',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/brands/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل ماركة',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/brands/list'
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
    var special = this.f.special.value ;
    var sort  = this.f.sort.value ;

    const newItem  : {[k: string]: any} = {}

    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.activated = activated;
    newItem.special = special == true ? 1 : 0 
    newItem.sort = sort

    if(photo !=  null )
      newItem.image = photo

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
     
    console.log(newItem)
    this.service.updateBrand( this.brand.id, newItem).then(
      res=> {
      this.loaderBtn = false  ;
      photo = null; 
      this.toastr.success(this.translate.instant('msg.editBrand'))
      setTimeout(() => 
        {
          this.router.navigate(['/brands/list']);
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

 
}
