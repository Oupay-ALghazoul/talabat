import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { OutOfStock } from 'src/app/models/OutOfStock'

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
  OutOfStock : OutOfStock;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.service.getOutOfStockById(this.route.snapshot.params['id']).then(
        (data : OutOfStock)=> {
        this.loader = false;
        this.OutOfStock = data;
        console.log(data);
        this.editForm = this.formBuilder.group({
          name_en: [this.OutOfStock.name_en , Validators.required],
          name_ar: [this.OutOfStock.name_ar , Validators.required], 
          
        });
    
      })
  }

  ngOnInit() {
  
    this.breadcrumb = {
      'mainlabel': 'Edit Out Of Stock',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/outOfStock/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل حالة',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/outOfStock/list'
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
    
    const newItem  : {[k: string]: any} = {}

    newItem.name_en = name_en;
    newItem.name_ar = name_ar;

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
     
    console.log(newItem)
    this.service.updateOutOfStock( this.OutOfStock.id, newItem).then(
      res=> {
      this.loaderBtn = false   
      this.toastr.success(this.translate.instant('msg.editdOutOfStock'))
      setTimeout(() => 
        {
          this.router.navigate(['/outOfStock/list']);
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
