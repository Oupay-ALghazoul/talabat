import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';

let langCode;
let langId;
let photo

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit , OnDestroy {

 
  public breadcrumb: any; 
  public breadcrumbAr: any; 

  addForm: FormGroup;
  loader = false;
  submitted = false;

  arabic : boolean;
  special = false ;
  

  constructor(private formBuilder: FormBuilder,private service: Constant , private router: Router
    ,private translate: TranslateService ,  private toastr: ToastrService , 
    private location: Location , private cd: ChangeDetectorRef) { 
      this.translateMethod()
    }
  ngOnDestroy() {
    photo = null;
  } 
  ngOnInit() {
    photo = null;
    this.breadcrumb = {
      'mainlabel': 'Add Brand',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/brands/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة ماركة',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/brands/list'
        },
    
      ]
    };


    this.addForm = this.formBuilder.group({
      name_en: ['',Validators.required ],
      name_ar: ['',Validators.required ], 
      special : [false,Validators.required ], 
      sort : ['' , [Validators.required , Validators.min(0)] ] ,
      image: ['']
    });

    
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
    var special = this.f.special.value ;
    var sort  = this.f.sort.value ;

    const newItem  : {[k: string]: any} = {}

    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.special = special == true ? 1 : 0 ;
    newItem.image = photo
    newItem.sort = sort
  
    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
    
    if( photo == null )
    {
       this.toastr.warning(this.translate.instant('msg.uploadPhoto'))
       this.loader = false;
       return;
    }
    console.log(newItem)
    this.service.addBrand(newItem).then(
      res=> {
      this.loader = false;
      photo = null;
      this.toastr.success(this.translate.instant('msg.addBrand'))
      setTimeout(() => 
        {
          this.router.navigate(['/brands/list']);
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
