import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/constant';
import 'jspdf-autotable'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';

//lang variables
let langCode;
let langId;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public breadcrumb: any;
  public breadcrumbAr :any;

  public basicCollapse1 = false;
  public basicCollapse2 = false;

  loader : boolean =true;
  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result : any[]=[];

  
  search : FormGroup;

  loaderBtn : boolean =  false;
  deliveries 
  isItems : boolean = false
  
  
  number_filter = ''
  from = '' 
  to = ''
  fromTime = '' 
  toTime = ''
  user_id = ''
  state_filter = ''
  payment_state_filter = ''

  arabic : boolean;
  myDateValue: Date;
  myDateValue2: Date ;
  public loader_refresh: boolean = false;

  constructor( private router: Router,   private modal: NgbModal  ,
    private formBuilder: FormBuilder , public service :Constant ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
    var date = new Date("2021-1-1");
    var today = new Date();
    var from = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
    this.myDateValue = from;
    var date2 = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
    this.myDateValue2 = date2;
    
    this.search = this.formBuilder.group({
      from : [this.myDateValue] ,
      to : [ this.myDateValue2] ,
      fromTime : [''] ,
      state_filter : [''] ,
      payment_state_filter  : [''] ,
      toTime : [''] ,
      number_filter : [''] 
    });
    
    this.getOrders()
  }
  get f() {
    return this.search.controls;
  }
 
  searchBtn(){
    this.loaderBtn = true ;
    this.page = 1 ;

    this.number_filter =  this.f.number_filter.value; 
    this.from = formatDate(this.myDateValue, 'yyyy-MM-dd', 'en');
    this.to = formatDate(this.myDateValue2, 'yyyy-MM-dd', 'en')
    this.fromTime = this.f.fromTime.value 
    this.toTime = this.f.toTime.value 
    this.state_filter = this.f.state_filter.value ;
    this.payment_state_filter = this.f.payment_state_filter.value;

    this.loader = true;
    this.isItems = false;
    if (this.to.toString() < this.from.toString()) {
      if(langCode  == 'ar'){
        this.toastr.warning( "الفترة الزمنية المدخلة غير صالحة");
      }else{
        this.toastr.warning( "Time Period not Valid");
      }
      this.loaderBtn = false;
      this.loader=false;
      this.isItems = true
      return
    }
    if(this.toTime < this.fromTime ){
      if(langCode  == 'ar'){
        this.toastr.warning( "الفترة الزمنية المدخلة  بالساعات غير صالحة");
      }else{
        this.toastr.warning( "Time Period By Hours not Valid");
      }
      this.loaderBtn = false;
      this.loader=false;
      this.isItems = false;
      return
    }
    this.getOrders()
  }
   
  reset(){
    var date = new Date("2021-1-1");
    var today = new Date();
    var from = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
    this.myDateValue = from;
    var date2 = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
    this.myDateValue2 = date2;

    this.search = this.formBuilder.group({
      from : [this.myDateValue] ,
      to : [ this.myDateValue2] ,
      state_filter : [''] ,
      payment_state_filter  : [''] ,
      fromTime : [''] ,
      toTime : [''] ,
      number_filter : [''] 
    });
  }
  refresh(){
    this.loader = true;
    this.isItems = false;
    this.getOrders()
  }
  getOrders(){
    if(this.fromTime != ''){
      this.fromTime = this.fromTime + ":00" 
    }
    if(this.toTime != ''){
      this.toTime = this.toTime + ":00" 
    }
  this.service.getAllOrdersWithFilter(this.page , this.from , this.to ,
    this.fromTime , this.toTime , this.number_filter , this.user_id ,   this.state_filter , this.payment_state_filter )
      .then(
      (data : any ) =>{
      this.result = data.data;
      console.log(data)
      if(this.result.length != 0)
        this.isItems = true;
      this.total = data.total;
      let dev = (this.total / 10) >> 0;       
      let remain = this.total % 10;
      if(remain > 0)
      dev = dev + 1 ;
      this.collectionSize = dev * 10 ;   
      this.loaderBtn = false;
      this.loader=false;
      }, err => {
        this.loader=false;
      });
  }
  
  showDetails(id){
    this.router.navigate(['/orders/details/' + id]);
  }

  translateMethod(){
    this.translate.setDefaultLang('en');
    this.translate.addLangs(['en', 'ar']);     
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
  id_deleted_Item;
  deleteLoader : boolean = false;
  addModal = null;

  ConfirmDataModal(confirmDataModalContent,id) {
    console.log(id)
    this.id_deleted_Item = id
    this.addModal = this.modal.open(confirmDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  delete(confirmForm)
  {
    this.deleteLoader = true;
    this.service.deleteOrder( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.isItems = false;
        this.getOrders()
    },err => {
        this.toastr.error(err)
        this.deleteLoader = false; 
        this.addModal.close(confirmForm.resetForm); 
    })
  }
  close(confirmForm){
    this.addModal.close(confirmForm.resetForm);
  }
  ngOnInit() {

    this.loader=true;

    this.breadcrumb = {
      'mainlabel': 'Purchase Orders',
    };
    this.breadcrumbAr = {
      'mainlabel': 'طلبات الشراء',
    };

  } 

  onPageChange(page)
  {
    this.loader=true;
    this.page = page;
    this.getOrders()
  }

 
 
}
