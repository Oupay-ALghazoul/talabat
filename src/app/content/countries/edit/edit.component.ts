import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { Country} from 'src/app/models/Country'

let langCode;
let langId;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  arabic : boolean;

  public breadcrumb: any; 
  public breadcrumbAr : any;
  submitted = false;
  
  editForm: FormGroup;

  loader : boolean =true;
  loaderBtn = false;
  country : Country ;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.service.getCountryById(this.route.snapshot.params['id']).then(
        (data : Country)=> {
        this.loader = false;
        this.country = data ;
        console.log(this.country)
        this.editForm = this.formBuilder.group({
          // name_en: [this.country.name_en , Validators.required],
          // name_ar: [this.country.name_ar , Validators.required],
          // abbreviation: [this.country.abbreviation ,[ Validators.maxLength(5) , Validators.required]], 
          // international_code:  [this.country.international_code , [Validators.maxLength(5) , Validators.required]]
        });
    
      })
      
    }


  get f() {
    return this.editForm.controls;
  }
  submit()
  {
    this.loaderBtn = true   

    var name_en =  this.f.name_en.value; 
    var name_ar = this.f.name_ar.value;
    var abbreviation = this.f.abbreviation.value;
    var international_code =  this.f.international_code.value; 
  
    const  newItem = {
        "name_en":"",
        "name_ar":"",
        "abbreviation":"",
        "international_code":""
    }
    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.abbreviation = abbreviation ;
    newItem.international_code = international_code ;
    
    this.submitted = true;
      if (this.editForm.invalid) {
        this.loaderBtn = false;
        return;
      }
    this.service.updateCountry( this.country.id , newItem).then(
      res=> {
      this.loaderBtn = false ;
      this.toastr.success(this.translate.instant('msg.editCountry'))
      setTimeout(() => 
        {
          this.router.navigate(['/countries/list']);
        },
        1000);
    },err => {
      this.loaderBtn = false   
      this.toastr.error(err)
    })


  }
  ngOnInit() {
  
    this.breadcrumb = {
      'mainlabel': 'Edit Country',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/countries/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل دولة',
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
