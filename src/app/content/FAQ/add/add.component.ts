import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';

let langCode;
let langId;
let formData;

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

  loader = false;

  constructor(private formBuilder: FormBuilder,private service: Constant , private router: Router
    ,private translate: TranslateService ,  private toastr: ToastrService , 
    private location: Location) { 
      formData = new FormData();
      this.translateMethod();
      this.addForm = this.formBuilder.group({
        question_ar: ['',[Validators.required , Validators.pattern('[\u0600-\u06FF ]*')] ],
        question_en: ['',[ Validators.required , Validators.pattern('[a-zA-Z ]*')] ], 
        answer_en:  ['',[ Validators.required , Validators.pattern('[a-zA-Z ]*')]],
        answer_ar : ['',[Validators.required , Validators.pattern('[\u0600-\u06FF ]*')] ]
      });
    }
  get f() {
    return this.addForm.controls;
  }
  submit()
  {
    this.loader = true;

    var question_en =  this.f.question_en.value; 
    var question_ar = this.f.question_ar.value;
    var answer_en =  this.f.answer_en.value; 
    var answer_ar = this.f.answer_ar.value;

    formData.append("question_en", question_en);    
    formData.append("question_ar", question_ar);
    formData.append("answer_en", answer_en);    
    formData.append("answer_ar", answer_ar);
    
    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
    
     formData.forEach((value,key) => {
        console.log(key+value)
         });

    this.service.addNewFAQ(formData).then(
      res=> {
      this.loader = false;
      this.toastr.success(this.translate.instant('msg.addFaq'));
      setTimeout(() => 
        {
          this.router.navigate(['/FAQs/list']);
        },
        1000);
    },err => {
      this.loader = false;
      this.toastr.error(err)
    })


  }
  ngOnInit() {
  
    this.breadcrumb = {
      'mainlabel': 'Add FAQ',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/FAQs/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة سؤال',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/FAQs/list'
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
