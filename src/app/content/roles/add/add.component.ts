import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';

let langCode;
let langId;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  arabic : boolean;
  public breadcrumb: any; 
  public breadcrumbAr: any; 

  submitted = false;
  addForm: FormGroup;
  
  Permissions = [] ;
  selectedTag  : number[] =[]
  loader=true;
  loaderBtn = false;

  constructor(private formBuilder: FormBuilder,private service: Constant , private router: Router
    ,private translate: TranslateService ,  private toastr: ToastrService , 
    private location: Location) { 
      this.translateMethod()
      this.service.getAllPermissions().then((data:any)=>{
        this.Permissions = data
        this.loader = false
        console.log(data)
      })
      this.addForm = this.formBuilder.group({
        name_en: ['',Validators.required ],
        name_ar: ['',Validators.required ], 
        selectedTag:  ['',Validators.required ],
      });
    }

  get f() {
    return this.addForm.controls;
  }
  submit()
  {
    this.loaderBtn = true;

    var name_en =  this.f.name_en.value; 
    var name_ar = this.f.name_ar.value;
    
    const newItem ={
      "name_en" : "" ,
      "name_ar" : "" ,
      "permissions" : []
    } 
    newItem.name_ar = name_ar;
    newItem.name_en = name_en;
    newItem.permissions = this.selectedTag
    
    this.submitted = true;
    if (this.addForm.invalid) {
      this.loaderBtn = false;
      return;
    }
    console.log(newItem)

    this.service.addNewRole(newItem).then(
      res=> {
      this.loaderBtn = false;
      this.toastr.success(this.translate.instant('msg.addRole'))
      setTimeout(() => 
        {
          this.router.navigate(['/roles/list']);
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
  ngOnInit() {
    
    this.breadcrumb = {
      'mainlabel': 'Add Role',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/roles/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة دور',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/roles/list'
        },
    
      ]
    };
  }
  cancel()
  {
    this.location.back();
  }

}
