import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant } from 'src/app/constant';

//lang variables
let langId;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ContactUsComponent implements OnInit {

  arabic : boolean;
  langCode : string ;

  public breadcrumb: any;
  public breadcrumbAr :any;

  loader : boolean =true;
  
  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result ;

  search : FormGroup;
  loaderBtn : boolean =  false;
  word = '' ; 

  isItems : boolean

  constructor( private router: Router,  public service : Constant , 
    private formBuilder: FormBuilder , private translate: TranslateService ) { 
    this.translateMethod();
    this.search = this.formBuilder.group({
      word_filter: [''],
    });
    this.getContactUs()
  }
 
  getContactUs(){
    this.service.getContactUs( 'true' , this.page , this.word).then((data : any) =>{
        this.result = data.data;
        console.log(data)
        if( this.result.length != 0)     
          this.isItems = true;   
        console.log( data)     
        this.total = data.total;
        let dev = (this.total / 10) >> 0;       
        let remain = this.total % 10;
        if(remain > 0)
        dev = dev + 1 ;
        this.collectionSize = dev * 10 ;   
        this.loader=false;
        this.loaderBtn = false ;
      }, err => {
        this.loader=false;
        this.isItems = false;    
        this.loaderBtn = false ;
      });
  }
 
  get f() {
    return this.search.controls;
  }
  searchBtn(){
    this.loaderBtn = true ;
    this.word =  this.f.word_filter.value; 
    this.page = 1 ;
    this.isItems = false;
    this.loader=true;
    this.getContactUs()
  }
  onPageChange(page)
  {
    this.page = page;
    this.loader = true;
    this.getContactUs()
  }
  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'Contact Us',
    };
    this.breadcrumbAr = {
      'mainlabel': 'اتصل بنا',
    };
    
  } 
  translateMethod(){
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    this.langCode = lang.split('"').join('');
    this.translate.use(this.langCode);
    // console.log(langCode)
    let lang_id = localStorage.getItem("langId");
    langId = lang_id.split('"').join('');
    if (Number(langId) == 1){
      this.arabic = true;
    }else{
      this.arabic = false;
    }
  }
}
