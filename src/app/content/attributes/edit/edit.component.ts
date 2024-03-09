import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { Attribute  } from 'src/app/models/Attribute'

let langCode;
let langId;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  
  public breadcrumb: any; 
  public breadcrumbAr : any;

  arabic : boolean;

  submitted = false;
  editForm: FormGroup;

  loader=true;
  loaderBtn = false;
  Attribute : Attribute ;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.service.getAttributeById(this.route.snapshot.params['id']).then(
        (data : Attribute )=> {
        this.loader = false;
        this.Attribute = data;
        console.log(data);
        this.editForm = this.formBuilder.group({
          name_en: [this.Attribute.name_en , Validators.required],
          name_ar: [this.Attribute.name_ar , Validators.required], 
          sort: [this.Attribute.sort ]
        });
    
      })
  }

  ngOnInit() {
  
    this.breadcrumb = {
      'mainlabel': 'Edit Attributes',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/attributes/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل خاصية',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/attributes/list'
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
    var sort = this.f.sort.value;

    const newItem  : {[k: string]: any} = {}

    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.sort = sort

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
     
    console.log(newItem)
    this.service.updateAttribute( this.Attribute.id, newItem).then(
      res=> {
      this.loaderBtn = false   
      this.toastr.success(this.translate.instant('msg.editAttribute'))
      setTimeout(() => 
        {
          this.router.navigate(['/attributes/list']);
        },
        1000);
    },err => {
      this.loaderBtn = false   
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

 
}
