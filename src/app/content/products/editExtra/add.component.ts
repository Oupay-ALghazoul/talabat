import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductExtra }  from 'src/app/models/ProductExtra'

let langCode;
let langId;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class EditExtraComponent implements OnInit {
  arabic : boolean;

  public breadcrumb: any; 
  public breadcrumbAr: any; 

  submitted = false;

  editForm: FormGroup;

  extraId ;
  product_id ;

  loader : boolean = true ;
  loaderBtn = false;

  constructor(private formBuilder: FormBuilder,private service: Constant 
    ,private translate: TranslateService ,  private toastr: ToastrService ,  private router: Router, 
    private location: Location , private cd: ChangeDetectorRef ,     private route: ActivatedRoute
    ) { 
      this.translateMethod();
      this.extraId =   this.route.snapshot.params['id'];
      this.service.getProductExtraById( this.extraId ).then((data : ProductExtra ) =>{
        console.log(data)
        this.loader = false;
        this.product_id = data.product_id ;
        this.editForm = this.formBuilder.group({
          title: [data.title,Validators.required ],
          title_ar: [data.title_ar,Validators.required ],
          // required : [data.required == 1 ? true : false ,Validators.required] ,
          description: [ data.description ,Validators.required ], 
          description_ar: [data.description_ar,Validators.required ],
          max: [data.max,Validators.required] 
        });
        this.breadcrumb = {
          'mainlabel': 'Edit Product Extra',
          'links': [
            {
              'name': 'Previous List',
              'isLink': true,
              'link': '/products/extraList/' +   this.product_id 
            },
        
          ]
        };
        this.breadcrumbAr = {
          'mainlabel': 'تعديل اكسترا المنتج',
          'links': [
            {
             'name': 'القائمة السابقة' ,
              'isLink': true,
              'link': '/products/extraList/' +   this.product_id 
            },
        
          ]
        };
      })
    }


  get f() {
    return this.editForm.controls;
  }
  submit()
  {
    this.loaderBtn = true;

    var title =  this.f.title.value; 
    var title_ar = this.f.title_ar.value;
    var description = this.f.description.value;
    var description_ar = this.f.description_ar.value;
    var max = this.f.max.value;
    // var required = this.f.required.value

    const newItem  = {
      "product_id":"",
      "title":"",
      "title_ar":"",
      // "required" : "" ,
      "description":"",
      "description_ar" : "" ,
      "max":""
    }
    newItem.product_id = this.product_id ;
    newItem.title = title ;
    newItem.title_ar = title_ar ;
    newItem.description = description;
    newItem.description_ar = description_ar;
    newItem.max = max;
    // newItem.required =  required == true ? "1" : "0";

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
  
    this.service.updateProductExtra( this.extraId , newItem).then(
      res=> {
      this.loader = false;
      this.toastr.success(this.translate.instant('msg.editProductExtra'))
     
      setTimeout(() => 
        {
          this.router.navigate(['/products/extraList/' +   this.product_id ]);
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

  }
}
