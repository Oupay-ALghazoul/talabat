import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { FAQ } from 'src/app/models/FAQ'

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
  item : FAQ;

  param_id ;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.param_id = this.route.snapshot.params['id']
      this.service.getFAQById( this.param_id ).then(
        (data : FAQ)=> {
        this.loader = false;
        this.item = data;
        console.log(data);
        this.editForm = this.formBuilder.group({
          question_en: [this.item.question_en ,[ Validators.required , Validators.pattern('[a-zA-Z ]*')] ],
          question_ar: [this.item.question_ar , [Validators.required , Validators.pattern('[\u0600-\u06FF ]*')] ], 
          answer_en:  [this.item.answer_en ,[ Validators.required , Validators.pattern('[a-zA-Z ]*')]],
          answer_ar : [this.item.answer_ar ,[Validators.required , Validators.pattern('[\u0600-\u06FF ]*')] ]
        });
      })
    }

  get f() {
    return this.editForm.controls;
  }

  submit()
  {
    this.loaderBtn = true ;

    var question_en =  this.f.question_en.value; 
    var question_ar = this.f.question_ar.value;
    var answer_en =  this.f.answer_en.value; 
    var answer_ar = this.f.answer_ar.value;

    const newItem = {
      "question_en":"",
      "question_ar":"",
      "answer_en":"",
      "answer_ar":""
    }
    newItem.question_ar = question_ar;
    newItem.question_en = question_en ;
    newItem.answer_ar = answer_ar ;
    newItem.answer_en = answer_en
  
    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
    this.service.updateFAQ( this.item.id, newItem).then(
      res=> {
      this.loaderBtn = false   
      this.toastr.success(this.translate.instant('msg.editFaq'));
      setTimeout(() => 
        {
          this.router.navigate(['/FAQs/list']);
        },
        1000);
    },err => {
      this.loaderBtn = false   
      this.toastr.error(err)
    })


  }

  ngOnInit() {  
    this.breadcrumb = {
      'mainlabel': 'Edit FAQ',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/FAQs/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل السؤال',
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
