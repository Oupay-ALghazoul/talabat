import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from 'src/app/_services/user-service.service';

//lang variables
let langId;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class HistoryComponent implements OnInit {

  public breadcrumb: any;
  public breadcrumbAr :any;
  public breadcrumbku : any;

  loader : boolean =true;
  arabic : boolean;
  langCode : string ;

  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result ;
  addModal = null;

  search : FormGroup;
  countries ;
  loaderBtn : boolean =  false;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showAdd : boolean ;
  
  today = new Date() ;
  format_date 

  constructor( private router: Router, private permission: UserServiceService ,
    private formBuilder: FormBuilder , public service : Constant ,  private modal: NgbModal ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
    this.format_date = this.convertDatePickerTimeToMySQLTime(this.today) ;
    console.log(this.convertDatePickerTimeToMySQLTime(this.today))

     // add permission
     if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_discount")
        ? (this.showAdd = true)
        : (this.showAdd = false);
      }
      if (
        this.permission.getUser() &&
        this.permission.getUser().super_admin === true
      ) {
        this.showAdd = true;
      }

    this.search = this.formBuilder.group({
      name: [''],
    });
    this.getCodes ()
   
  }
 
  getCodes(){
    // 
    this.service.getDiscount( 'false' ,  this.page )
    .then((data : any) =>{
      console.log(data)     
      this.result = data;
      if(this.result.length != 0)
      this.isItems = true;
      this.loader = false ;
      // this.total = data.total;
      // let dev = (this.total / 10) >> 0;       
      // let remain = this.total % 10;
      // if(remain > 0)
      // dev = dev + 1 ;
      // this.collectionSize = dev * 10 ;   
      }, err => {
        this.toastr.error(err.error)
      });
  }
  get f() {
    return this.search.controls;
  }
  
  searchBtn(){
    this.loaderBtn = true ;

    // this.word = this.f.word_filter.value; 
    // this.phone = this.f.phone_filter.value; 
    // this.state = this.f.activated.value; 
    // this.role = this.f.role_filter.value; 

    this.page = 1 ;
    this.loader = true;
    this.isItems = false;
    this.getCodes()
  }
  onPageChange(page)
  {
    this.page = page ;
    this.loader = true ;
    this.getCodes ()
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
 
  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'Discount Codes History',
    };
    this.breadcrumbAr = {
      'mainlabel': 'سجل أكواد الحسم',
    };
  
  } 
 
 
  id_deleted_Item;

  ConfirmDataModal(confirmDataModalContent,id) {
    this.id_deleted_Item = id
    this.addModal = this.modal.open(confirmDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  deleteLoader : boolean = false;
  isItems = false;
  
  delete(confirmForm)
  {
    this.deleteLoader = true; 
    // (<HTMLInputElement>document.getElementById("loader"+id)).hidden = false;
    // (<HTMLInputElement>document.getElementById("delete"+id)).hidden = true;
    this.service.deleteDiscount( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.isItems = false
        this.getCodes ()
    },err => {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.toastr.error(err)
    })
  }
  close(confirmForm){
    this.addModal.close(confirmForm.resetForm);
  }
  addCodeModal = null;
  addForm : FormGroup
  title
  addCodeMarketing(addDiscountModalContent) {  
    this.submitted = false ;
    if(this.langCode  == 'ar'){
      this.title =   "ارسال كود للتسويق"
    }else if(this.langCode  == 'en'){
      this.title =   "Send For Marketing Code"
    }else{
      this.title =   "Send For Marketing Code kur"
    }
    this.addForm = this.formBuilder.group({
      title: ['' ],
      body: ['' ] ,
      percentage: ['' ,[Validators.min(1), Validators.max(100)] ],
      amount : ['' ] ,
      for_marketing : [true , Validators.required ] ,
      on_delivery_cost : [false , Validators.required ] ,
      expiration : ['' , Validators.required ] ,
      code  : ['' , Validators.required ] ,
      active : [true ,  Validators.required ]
    });
    this.addCodeModal = this.modal.open(addDiscountModalContent, {
      windowClass: 'animated fadeInDown'
    });
    (<HTMLInputElement>document.getElementById("percentage")).disabled = true;
    (<HTMLInputElement>document.getElementById("code")).disabled = false

  }
  addCode(addDiscountModalContent) {  
    this.submitted = false ;
    if(this.langCode  == 'ar'){
      this.title = "ارسال كود عام"
    }else if(this.langCode  == 'en'){
      this.title = "Send General Code"
    }else{
      this.title = "Send General Code kur"
    }
    
    this.addForm = this.formBuilder.group({
      title: ['' ],
      body: ['' ] ,
      percentage: ['' ,[Validators.min(1), Validators.max(100)] ],
      amount : ['' ] ,
      for_marketing : [false , Validators.required ] ,
      on_delivery_cost : [false , Validators.required ] ,
      expiration : ['' , Validators.required ] ,
      code  : ['' , Validators.required ] ,
      active : [true ,  Validators.required ]
    });
    this.addCodeModal = this.modal.open(addDiscountModalContent, {
      windowClass: 'animated fadeInDown'
    });
    (<HTMLInputElement>document.getElementById("percentage")).disabled = true;
  }
  addFormDelivery : FormGroup
  addCodeDeliveryModal = null
  addCodeDelivery(addDiscountModalContent2){
    this.submitted = false ;
    this.addFormDelivery= this.formBuilder.group({
      title: ['' ],
      body: ['' ] ,
      // percentage: ['' ,[Validators.min(1), Validators.max(100)] ],
      amount : ['0'] ,
      for_marketing : [false , Validators.required ] ,
      on_delivery_cost : [true , Validators.required ] ,
      expiration : ['' , Validators.required ] ,
      code  : ['' , Validators.required ] ,
      active : [true ,  Validators.required ]
    });
    this.addCodeDeliveryModal = this.modal.open(addDiscountModalContent2, {
      windowClass: 'animated fadeInDown'
    });
  }
  changeWay(event){
    console.log(event)
    if(event == "percentage"){
      this.addForm.patchValue({"amount" : ''}) ;
      (<HTMLInputElement>document.getElementById("amount")).disabled = true;
      (<HTMLInputElement>document.getElementById("percentage")).disabled = false;
    }else{
      this.addForm.patchValue({"percentage" : ''});
      (<HTMLInputElement>document.getElementById("percentage")).disabled = true;
      (<HTMLInputElement>document.getElementById("amount")).disabled = false;
    }
  }
  get g() {
    return this.addForm.controls;
  }
  
  submitted : boolean = false
  addLoader : boolean = false
  submit(addOptionForm){
    console.log(addOptionForm)
    this.submitted = true;
    this.addLoader = true;
    var title =  this.g.title.value; 
    var body = this.g.body.value;
    var percentage =  this.g.percentage.value; 
    var amount = this.g.amount.value;
    var expiration =  this.g.expiration.value; 
    var code = this.g.code.value;
    var for_marketing = this.g.for_marketing.value;
    var on_delivery_cost = this.g.on_delivery_cost.value
    var active = this.g.active.value

    const newItem = {
      "title" : "",
      "body" : "" ,
      "percentage" : "" ,
      "amount" : "",
      "expiration" : "" ,
      "code" : "" ,
      "for_marketing" : "" ,
      "on_delivery_cost" : "" ,
      "active" : ""
    }
    newItem.title = title
    newItem.body = body
    newItem.percentage = percentage 
    newItem.amount = amount   
    newItem.expiration = this.convertDatePickerTimeToMySQLTime(expiration)
    newItem.code = code
    newItem.for_marketing = for_marketing
    newItem.on_delivery_cost = on_delivery_cost
    newItem.active = active

    if (this.addForm.invalid) {
      this.addLoader = false;
      return;
    }
    if (this.convertDatePickerTimeToMySQLTime(expiration) <= this.format_date){
      this.toastr.warning(this.translate.instant('msg.discountExpiration'));
      this.addLoader = false;
      return;
    }
    if (percentage == '' && amount == ''){
      this.toastr.warning(this.translate.instant('msg.discountValue'));
      this.addLoader = false;
      return;
    }
 
    console.log(newItem)
    this.service.sendDiscount(newItem).then(
      res=> {
      this.addLoader = false;
      this.toastr.success(this.translate.instant('msg.discountAdded'));
      this.closeAddOption(addOptionForm)
      this.submitted = false ;
      this.loader=true;
      this.getCodes ()
      // setTimeout(() => 
      //   {
      //     this.router.navigate(['/mealSubCategories/list']);
      //   },
      //   1000);
    },err => {
      this.addLoader = false;
      this.toastr.error(err)
    })
    
  }
  get h() {
    return this.addFormDelivery.controls;
  }
  addLoader2 : boolean = false
  submitDelivery(addFormDelivery) {
    console.log(addFormDelivery)
    this.submitted = true;
    this.addLoader2 = true;
    var title =  this.h.title.value; 
    var body = this.h.body.value;
    // var percentage =  this.h.percentage.value; 
    // var amount = this.h.amount.value;
    var expiration =  this.h.expiration.value; 
    var code = this.h.code.value;
    // var for_marketing = this.h.for_marketing.value;
    // var on_delivery_cost = this.h.on_delivery_cost.value
    var active = this.h.active.value
    const newItem = {
      "title" : "",
      "body" : "" ,
      "percentage" : "" ,
      "amount" : "0",
      "expiration" : "" ,
      "code" : "" ,
      "for_marketing" : false ,
      "on_delivery_cost" : true ,
      "active" : ""
    }
    newItem.title = title
    newItem.body = body 
    newItem.expiration =  this.convertDatePickerTimeToMySQLTime(expiration)
    newItem.code = code
    newItem.active = active
    console.log(newItem)
    if (this.addFormDelivery.invalid) {
      this.addLoader2 = false;
      return;
    }
    console.log(this.convertDatePickerTimeToMySQLTime(expiration))
    if (this.convertDatePickerTimeToMySQLTime(expiration) <= this.format_date){
      this.toastr.warning(this.translate.instant('msg.discountExpiration'));
      this.addLoader2 = false;
      return;
    }
    this.service.sendDiscount(newItem).then(
      res=> {
      this.addLoader2 = false;
      this.toastr.success(this.translate.instant('msg.discountAdded'));
      this.closeAddDelivery(addFormDelivery)
      this.submitted = false ;
      this.loader=true;
      this.getCodes ()
      // setTimeout(() => 
      //   {
      //     this.router.navigate(['/mealSubCategories/list']);
      //   },
      //   1000);
    },err => {
      this.addLoader2 = false;
      this.toastr.error(err)
    })
  }
  
  closeAddOption(addDiscountModalContent){
    this.addForm.reset()
    this.addLoader = false;
    this.addCodeModal.close(addDiscountModalContent.resetForm);
  }
  closeAddDelivery(addDiscountModalContent2){
    this.addFormDelivery.reset()
    this.addLoader2 = false;
    this.addCodeDeliveryModal.close(addDiscountModalContent2.resetForm);
  }
  active ;
  onChange(data , i , event) {
  console.log(data)
  console.log(event);
  (<HTMLInputElement>document.getElementById("loaderHome" +  i )).hidden = false;
  (<HTMLInputElement>document.getElementById("change"+ i )).hidden = true;
  if(event == true){
    this.active = 1
  }else{
    this.active = 0
  }
  const newItem = {
    "code_group" : data.code_group ,
    "code" : data.code ,
    "active" : this.active
  }
 
  console.log(newItem)
    this.service.updateDiscount(newItem).then(
    res=> {    
    (<HTMLInputElement>document.getElementById("loaderHome" + i)).hidden = true;
    (<HTMLInputElement>document.getElementById("change" + i )).hidden = false;
    this.toastr.success(this.translate.instant('msg.discountState'));
     this.getCodes ()
  },err => {
    (<HTMLInputElement>document.getElementById("loaderHome"+ i )).hidden = true;
    (<HTMLInputElement>document.getElementById("change"+ i )).hidden = false;
    this.toastr.error(err)
  })
  }
  editCodeMarketing(addDiscountModalContent , row) {  
    console.log(row)
    if(this.langCode  == 'ar'){
      this.title =   "ارسال كود للتسويق"
    }else if(this.langCode  == 'en'){
      this.title =   "Send For Marketing Code"
    }else{
      this.title =   "Send For Marketing Code kur"
    }
    this.addForm = this.formBuilder.group({
      title: [row.title],
      body: [row.body ] ,
      percentage: [row.value.includes('%') ? row.value.substring(1) : '' ,[Validators.min(1), Validators.max(100)] ],
      amount : [row.value.includes('%') ? '' : row.value ] ,
      for_marketing : [true , Validators.required ] ,
      on_delivery_cost : [false , Validators.required ] ,
      expiration : [ new Date(row.expiration) , Validators.required ] ,
      code  : [row.code , Validators.required ] ,
      active : [ row.active , Validators.required ] ,
    });
  
    this.addCodeModal = this.modal.open(addDiscountModalContent, {
      windowClass: 'animated fadeInDown'
    });
    if (row.value.includes('%')) { 
      (<HTMLInputElement>document.getElementById("amount")).disabled = true;
    }else{
      (<HTMLInputElement>document.getElementById("percentage")).disabled = true;
    }
    (<HTMLInputElement>document.getElementById("code")).disabled = true;
  }
  editCodeDelivery(addDiscountModalContent2 , row){
    this.addFormDelivery= this.formBuilder.group({
      title: [row.title ],
      body: [row.body ] ,
      // percentage: ['' ,[Validators.min(1), Validators.max(100)] ],
      amount : ['0'] ,
      for_marketing : [false , Validators.required ] ,
      on_delivery_cost : [true , Validators.required ] ,
      expiration : [ new Date(row.expiration)  , Validators.required ] ,
      code  : [row.code , Validators.required ] ,
      active : [ row.active , Validators.required ] ,
    });
    this.addCodeDeliveryModal = this.modal.open(addDiscountModalContent2, {
      windowClass: 'animated fadeInDown'
    });
    (<HTMLInputElement>document.getElementById("code")).disabled = true;
  }
  editCode(addDiscountModalContent , row) {  
    if(this.langCode  == 'ar'){
      this.title = "ارسال كود عام"
    }else if(this.langCode  == 'en'){
      this.title = "Send General Code"
    }else{
      this.title = "Send General Code kur"
    }
    console.log(row)
    this.addForm = this.formBuilder.group({
      title: [row.title],
      body: [row.body ] ,
      percentage: [row.value.includes('%') ? row.value.substring(1) : '' ,[Validators.min(1), Validators.max(100)] ],
      amount : [row.value.includes('%') ? '' : row.value ] ,
      for_marketing : [false , Validators.required ] ,
      on_delivery_cost : [false , Validators.required ] ,
      expiration : [ new Date(row.expiration)  , Validators.required ] ,
      code  : [row.code , Validators.required ] ,
      active : [ row.active , Validators.required ] ,
    });
    this.addCodeModal = this.modal.open(addDiscountModalContent, {
      windowClass: 'animated fadeInDown'
    });
    if (row.value.includes('%')) { 
      (<HTMLInputElement>document.getElementById("amount")).disabled = true;
    }else{
      (<HTMLInputElement>document.getElementById("percentage")).disabled = true;
    }
    (<HTMLInputElement>document.getElementById("code")).disabled = true;
  }
  convertDatePickerTimeToMySQLTime(str) {
    var month, day, year, hours, minutes, seconds;
    var date = new Date(str),
        month : any = ("0" + (date.getMonth() + 1)).slice(-2),
        day : any  = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);

    var mySQLDate = [date.getFullYear(), month, day].join("-");
    var mySQLTime = [hours, minutes, seconds].join(":");
    return [mySQLDate, mySQLTime].join(" ");
}
}
