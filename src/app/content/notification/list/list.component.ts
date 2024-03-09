import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgBlockUI ,BlockUI} from 'ng-block-ui';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TableApiService } from 'src/app/_services/table-api.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { Country } from 'src/app/models/Country';
import { DomSanitizer } from '@angular/platform-browser';
import { compileComponentFromMetadata } from '@angular/compiler';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// import * as $ from 'jquery';


//lang variables
let langCode;
let langId;

let formData;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public breadcrumb: any;
  public breadcrumbAr :any;
  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  loader : boolean =true;
  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result : any[]=[];
  public selected = [];
  search : FormGroup;
  searchForm: FormGroup;
  cities;
  countries ;
  loaderBtn : boolean =  false;
  addForm : FormGroup

  constructor( private router: Router,   private tableApiservice: TableApiService ,
    private sanitizer: DomSanitizer ,   private modal: NgbModal,  
    private formBuilder: FormBuilder , public service :Constant ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
    this.search = this.formBuilder.group({
      name: [''],
    });
    formData = new FormData();
    this.addForm = this.formBuilder.group({
      title: ['' , Validators.required ],
      body: ['' , Validators.required  ] 
      
    });
    this.getUsers()
  }
  get f() {
    return this.search.controls;
  }
  state = '' ;
  role = '' ;
  word = ''
  selectState(value : string){
    this.state = value
  }
  selectRole(value : string){
    this.role = value
  }
  searchBtn(){
    this.loaderBtn = true ;
    var name =  this.f.name.value; 
    this.word = name
    this.loader = true;
    this.isItems = false;
    this.getUsers()
  }
 
  getUsers(){
    // this.service.getAllUsersWithoutPage( this.state , this.role , this.word ).then(
    //   (data : any ) =>{
    //     console.log(data)
    //   this.result = data;
     
    //   if(this.result.length != 0)
    //     this.isItems = true;
   
    //   this.loaderBtn = false;
    //   this.loader=false;
    //   }, err => {
    //     this.loader=false;
    //   });
  }
  arabic : boolean;

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
  showDetails(id){
    this.router.navigate(['/users/userInfo/' + id]);
  }
  photoURL(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  ngOnInit() {

    this.loader=true;

    this.breadcrumb = {
      'mainlabel': 'Users Notification',
    };
    this.breadcrumbAr = {
      'mainlabel': 'اشعارات المستخدمين',
    };

  } 
  selectedIds =  [];
  onSelectContact({ selected }) {
    console.log(selected)
    this.selectedIds.splice(0, this.selected.length);
    selected.forEach(element => {
      this.selectedIds.push(element.id);

    });
    console.log( this.selectedIds)
  }
  onPageChange(page)
  {
    this.loader=true;
    // this.service.getAllUsers(page).then(
    //   (data : any ) =>{
    //   this.loader=false;
    //   this.result = data.data;
    //   console.log( this.result)
    // })
  }

  isItems = false;

  id_deleted_Item;
  addOptionModal = null;
  addCode(addDiscountModalContent) {
    if (this.selectedIds.length == 0) {
      if(langCode  == 'ar'){
         this.toastr.info('اختر مستخدم أو أكثر');
       } else{
        this.toastr.info('Please select one or more users');
      }
  
    }else{
      this.addOptionModal = this.modal.open(addDiscountModalContent, {
        windowClass: 'animated fadeInDown'
      });
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
  
    const newItem = {
      "title" : "",
      "body" : "" ,
      "ids" : []
    }
    newItem.title = title
    newItem.body = body
    newItem.ids = this.selectedIds
 
    if (this.addForm.invalid) {
      this.addLoader = false;
      return;
    }
    console.log(newItem)
    this.service.sendNotification(newItem).then(
      res=> {
      this.addLoader = false;
      if(langCode  == 'ar'){
        this.toastr.success( "تم ارسال الاشعار  بنجاح");
      }else{
        this.toastr.success( "Notification Sended successfuly");
      }
      this.closeAddOption(addOptionForm)
      
      this.loader=true;
      this.getUsers()
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

  closeAddOption(addDiscountModalContent){
    this.addForm.reset()
    this.addOptionModal.close(addDiscountModalContent.resetForm);
  }
 

 
}
