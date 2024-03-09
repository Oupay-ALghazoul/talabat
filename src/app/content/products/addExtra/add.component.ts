import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { QuillEditorComponent } from 'ngx-quill';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router, ActivatedRoute } from '@angular/router';

let langCode;
let langId;
let formData;


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddExtraComponent implements OnInit {

  arabic : boolean;
  public breadcrumb: any; 
  public breadcrumbAr: any; 
  submitted = false;

  addForm: FormGroup;
  loader = false ;

  productId ;

  constructor(private formBuilder: FormBuilder,private service: Constant 
    ,private translate: TranslateService ,  private toastr: ToastrService ,  private router: Router, 
    private location: Location ,   private route: ActivatedRoute
    ) { 
      formData = new FormData();
      this.translateMethod();
      this.productId =   this.route.snapshot.params['id'] ;
      this.addForm = this.formBuilder.group({
        title: ['',Validators.required ],
        title_ar: ['',Validators.required ],
        description: ['',Validators.required ], 
        description_ar: ['',Validators.required ],
        max: ['' ,Validators.required] ,
        // required : [true ,Validators.required] 
      });
    }

 
  get f() {
    return this.addForm.controls;
  }
  submit()
  {
    this.loader = true;

    var title =  this.f.title.value; 
    var title_ar = this.f.title_ar.value;
    var description = this.f.description.value;
    var description_ar = this.f.description_ar.value;
    var max = this.f.max.value;
    // var required = this.f.required.value
  
    formData.append("title", title); 
    formData.append("title_ar" , title_ar )   
    formData.append("description", description);
    formData.append("description_ar", description_ar);
    formData.append("max" , max )
    formData.append("product_id" , this.productId  )
    // formData.append("required" , required == true ? "1" : "0")

    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
  
     formData.forEach((value,key) => {
        console.log(key+value)
         });

    this.service.addProductExtra(formData).then(
      res=> {
      this.loader = false;
      this.toastr.success(this.translate.instant('msg.addProductExtra'))
      setTimeout(() => 
        {
          this.router.navigate(['/products/extraList/' +   this.productId ]);
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
  ngOnInit() {    
    this.breadcrumb = {
      'mainlabel': 'Add Product Extra',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/products/extraList/' +   this.productId 
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة اكسترا المنتج',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/products/extraList/' +   this.productId 
        },
    
      ]
    };
    
  }
}
