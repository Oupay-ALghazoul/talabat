import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';

let langId;
let formData;
let langCode;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public breadcrumb: any; 
  public breadcrumbAr : any;

  submitted = false;
  addForm: FormGroup;
  loader = false;

  arabic : boolean;
  
  constructor(private formBuilder: FormBuilder,private service: Constant , 
     private router: Router ,
     private translate: TranslateService ,  private toastr: ToastrService , 
     private location: Location ) { 

      formData = new FormData();
      this.translateMethod();
      this.addForm = this.formBuilder.group({
        name_en: ['', Validators.required ],
        name_ar: ['',Validators.required ],
        abbreviation: ['',[Validators.required , Validators.maxLength(5)]], 
        international_code:  ['',[Validators.required , Validators.maxLength(5)] ]
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
    var abbreviation = this.f.abbreviation.value;
    var international_code =  this.f.international_code.value; 
  
    formData.append("name_en", name_en);    
    formData.append("name_ar", name_ar);
    formData.append("abbreviation", abbreviation);
    formData.append("international_code", international_code); 

    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
    formData.forEach((value,key) => {
      console.log(key+value)
       });
    this.service.addCountry(formData).then(
      res=> {
      this.loader = false;
      this.toastr.success(this.translate.instant('msg.addCountry'));
      setTimeout(() => 
        {
          this.router.navigate(['/countries/list']);
        },
        1000);
    },err => {
      this.loader = false;
      this.toastr.error( err) ;
    })

  }
 
  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'Add Country',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/countries/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة دولة',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/countries/list'
        },
    
      ]
    };

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
