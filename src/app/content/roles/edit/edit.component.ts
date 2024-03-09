import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { Role } from 'src/app/models/Role'

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
 
  loader=true;
  loaderBtn = false;

  role : Role;
  Permissions :[]
  selectedTag  : number[] =[]

  role_id

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.role_id = this.route.snapshot.params['id']
      this.service.getRoleById( this.role_id).then(
        (data : Role)=> {
        this.role = data;
        console.log(data);
        this.service.getAllPermissions().then((data:any)=>{
          this.Permissions = data
          console.log(data)
        })
        this.editForm = this.formBuilder.group({
          name_en: [this.role.name_en , Validators.required ],
          name_ar: [this.role.name_ar , Validators.required ], 
          selectedTag:  [this.role.permissions , Validators.required ],
        });
        data.permissions.forEach(element => {
          this.selectedTag.push(element.id);
    
        });
        this.loader = false;
  
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
    
    const newItem  : {[k: string]: any} = {}

    newItem.name_ar = name_ar;
    newItem.name_en = name_en;
    newItem.permissions = this.selectedTag
  
    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
    this.service.updateRole(  this.role_id , newItem).then(
      res=> {
      this.loaderBtn = false   
      this.toastr.success(this.translate.instant('msg.editRole'))
      setTimeout(() => 
        {
          this.router.navigate(['/roles/list']);
        },
        1000);
    },err => {
      this.loaderBtn = false   
      this.toastr.error(err)
    })


  }

  ngOnInit() {
  
    this.breadcrumb = {
      'mainlabel': 'Edit Role',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/roles/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل دور',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/roles/list'
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
