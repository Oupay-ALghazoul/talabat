import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { Payment } from 'src/app/models/Payment'

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
  Payment : Payment;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.service.getPaymentById(this.route.snapshot.params['id']).then(
        (data : Payment)=> {
        this.loader = false;
        this.Payment = data;
        console.log(data);
        this.editForm = this.formBuilder.group({
          name_en: [this.Payment.name_en , Validators.required],
          name_ar: [this.Payment.name_ar , Validators.required], 
          description_en : [ this.Payment.description_en,Validators.required ] ,
          description_ar : [this.Payment.description_ar,Validators.required ] ,
          instructions_ar : [this.Payment.instructions_ar,Validators.required ] ,
          instructions_en : [this.Payment.instructions_en,Validators.required ] ,
          type : [this.Payment.type]
        });
    
      })
  }

  ngOnInit() {
  
    this.breadcrumb = {
      'mainlabel': 'Edit Payment',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/payment/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل الدفع',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/payment/list'
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
    var description_en = this.f.description_en.value;
    var description_ar = this.f.description_ar.value;
    
    var instructions_en = this.f.instructions_en.value;
    var instructions_ar = this.f.instructions_ar.value;
    var type = this.f.type.value;

    const newItem  : {[k: string]: any} = {}

    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.description_en = description_en;
    newItem.description_ar = description_ar;
    newItem.instructions_en = instructions_en;
    newItem.instructions_ar = instructions_ar;
    newItem.type = type;

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
     
    console.log(newItem)
    this.service.updatePayment( this.Payment.id, newItem).then(
      res=> {
      this.loaderBtn = false   
      this.toastr.success(this.translate.instant('msg.editPayment'))
      setTimeout(() => 
        {
          this.router.navigate(['/payment/list']);
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
