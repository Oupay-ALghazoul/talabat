import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';
import { Constant } from 'src/app/constant';
import { Review  } from 'src/app/models/Review'
import { Product } from 'src/app/models/Product'
import { User } from 'src/app/models/User';

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
  Review : Review ;

  max: number = 5;
  public rate: number = 2;
  isReadonly: boolean = false;
  public overStar: number =2;
  percent

  products : Product [] ;
  users : User [] ;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private location: Location ,
    private formBuilder: FormBuilder, 
    private service: Constant,
    private toastr: ToastrService ,
    private translate: TranslateService) { 
      this.translateMethod();
      this.service.getReviewById(this.route.snapshot.params['id']).then(
        (data : Review )=> {
        this.Review = data;
        console.log(data);
        this.service.getAllProductsMenu().then((data : any) =>{
          this.products = data;
        }) 
        this.service.getAllUsersMenu().then((data : any) =>{
          this.users = data;
        })
        this.editForm = this.formBuilder.group({
          title: [ this.Review.title ,Validators.required ],
          comment: [ this.Review.comment ,Validators.required ] ,
          product_id  : [ this.Review.product_id ,Validators.required ] ,
          user_id : [ this.Review.user_id ,Validators.required ] ,
          state : [ this.Review.state ,Validators.required ]
        });
      
        this.rate = this.Review.rating;
        this.loader = false;
      })
  }

  ngOnInit() {
  
    this.breadcrumb = {
      'mainlabel': 'Edit Review',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/reviews/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل تقييم',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/reviews/list'
        },
    
      ]
    };
  }
  hoveringOver(value: number): void {
    this.overStar = value + 1;  
    this.percent = (value / this.max) * 100;
  }
 
  resetStar(): void {   
    this.rate =  this.overStar;
  }
  get f() {
    return this.editForm.controls;
  }
  submit()
  {
    this.loaderBtn = true   
  
    var title =  this.f.title.value; 
    var comment = this.f.comment.value;
    var product_id = this.f.product_id.value;
    var user_id  = this.f.user_id.value;
    var state = this.f.state.value ;

    const newItem  : {[k: string]: any} = {}

    newItem.title = title;
    newItem.comment = comment;
    newItem.product_id = product_id ;
    newItem.user_id = user_id;
    newItem.rating = this.overStar.toString();
    newItem.state = state ;

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
     
    console.log(newItem)
    this.service.updateReview( this.Review.id, newItem).then(
      res=> {
      this.loaderBtn = false   
      this.toastr.success(this.translate.instant('msg.editReview'))
      setTimeout(() => 
        {
          this.router.navigate(['/reviews/list']);
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
