import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from 'src/app/_services/user-service.service';

//lang variables
let langCode;
let langId;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AllNotificationComponent implements OnInit {
  arabic : boolean;

  public breadcrumb: any;
  public breadcrumbAr :any;

  loader : boolean =true;
  isItems  : boolean = false;

  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;

  result : any[]=[];

  search : FormGroup;
  role = '' ;
  word = '' ;

  loaderBtn : boolean =  false;
  addForm : FormGroup

  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showAdd : boolean ;

  constructor( private router: Router,   private modal: NgbModal,  
    private formBuilder: FormBuilder , public service :Constant , private permission: UserServiceService  ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();

    // add permission
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_notification")
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
      word_filter : [''],
      role : ['']
    });

    this.addForm = this.formBuilder.group({
      title : ['' , Validators.required  ]  ,
      body : ['' , Validators.required  ]  ,
      role : ['' ,  Validators.required ]
    });
    this.getNotification()
  }
  get f() {
    return this.search.controls;
  }
 
  searchBtn(){
    this.loaderBtn = true ;
    this.word =  this.f.word_filter.value; 
    this.role = this.f.role.value;
    this.loader = true;
    this.page = 1 ;
    this.isItems = false;
    this.getNotification()
  }

  getNotification(){
    this.service.getNotification( 'true' , this.page , this.word , this.role).then((data : any) =>{
      console.log(data)
      this.result = data.data;
     
      if(this.result.length != 0)
        this.isItems = true;
      this.total = data.total;
      console.log(this.total)
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

  onPageChange(page)
  {
    this.loader=true;
    this.page = page
    this.getNotification()
  }
  
  sendModal = null;
  submitted : boolean = false
  addLoader : boolean = false

  addNotification(sendModalContent) { 
    this.sendModal = this.modal.open(sendModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  get g() {
    return this.addForm.controls;
  }
  submit(addForm){
  
    this.addLoader = true;

    var title = this.g.title.value;
    var body = this.g.body.value;
    var role = this.g.role.value
    const newItem = {
      "title" : "" ,
      "body" : "" ,
      "role" : ""
    }
    newItem.title = title
    newItem.body = body
    newItem.role = role

    this.submitted = true;
    if (this.addForm.invalid) {
      this.addLoader = false;
      return;
    }
    console.log(newItem)
    this.service.sendNotification(newItem).then(
      res=> {
      this.addLoader = false;
      this.toastr.success(this.translate.instant('msg.sendNotification'));
      this.addForm.reset()
      this.close(addForm)
      this.sendModal.close(addForm.resetForm);
      this.submitted = false;
      this.loader=true;
      this.getNotification()
    },err => {
      this.addLoader = false;
      this.toastr.error(err)
    })
    
  }

  close(sendModalContent){
    this.addForm.reset()
    this.sendModal.close(sendModalContent.resetForm);
  }

  loaderExport : boolean = false
  exportToExcel(){
    this.loaderExport = true
    this.service.exportNotifications(this.page  , this.word ).then((data : any) =>{
      this.loaderExport = false
      this.downloadFile(data.file);
    })
  }
  //exportCities
  downloadFile(data: string) {
    window.open(data);
  }

  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'Customers Notification',
    };
    this.breadcrumbAr = {
      'mainlabel': 'اشعارات العملاء',
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
}
