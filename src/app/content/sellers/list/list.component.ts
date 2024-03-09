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
import { UserServiceService } from 'src/app/_services/user-service.service';

//lang variables
let langCode;
let langId;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public breadcrumb: any;
  public breadcrumbAr :any;
  arabic : boolean;

  loader : boolean =true;
  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result ;

  addModal = null;
  public basicCollapse1 = false;
  public basicCollapse2 = false;

  search : FormGroup;
  loaderBtn : boolean =  false;
  state = '' ;
  phone = '' ;
  word = '';

  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;
  showAdd : boolean ;
  showDelete : boolean ;

  constructor( private router: Router, private modal: NgbModal ,   private user: UserServiceService ,
    private formBuilder: FormBuilder , public service :Constant ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
     // permission add
     if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_seller")
        ? (this.showAdd = true)
        : (this.showAdd = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_seller")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    //  permission delete
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "delete_seller")
        ? (this.showDelete = true)
        : (this.showDelete = false);
    }
    if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showEdit = true;
      this.showAdd = true;
      this.showDelete = true;
    }
    this.search = this.formBuilder.group({
      word_filter : [''],
      phone_filter  : [''] ,
      activated : [''] 
    });  
    this.getSellers()
  }
 
  get f() {
    return this.search.controls;
  }
  
  searchBtn(){
    this.loaderBtn = true ;

    this.word = this.f.word_filter.value; 
    this.phone = this.f.phone_filter.value; 
    this.state = this.f.activated.value; 

    this.page = 1 ;
    this.loader = true;
    this.isItems = false;
    this.getSellers()
  }
  reset() {
    this.search = this.formBuilder.group({
      word_filter : [''],
      phone_filter  : [''] ,
      activated : [''] ,
    });
  }
  getSellers(){
    // public getAllDeliverypaginated , page , state , word
    this.service.getAllSellers( 'true' ,  this.page,  this.state , this.word , this.phone  ).then(
      (data : any ) =>{
        console.log(data)
        this.result = data.data; 
        if(this.result.length != 0)
          this.isItems = true;
        this.total = data.total;
        let dev = (this.total / 10) >> 0;       
        let remain = this.total % 10;
        if(remain > 0)
        dev = dev + 1 ;
        this.collectionSize = dev * 10 ;   
        this.loaderBtn = false;
        this.service.getAllCountriesMenu()
        .then((data : Country []) =>{
          console.log(data.length)
          localStorage.setItem("all_countries", JSON.stringify(data));
        })
        this.loader=false;
      }, err => {
        this.loader=false;
      });
  }
  onPageChange(page)
  {
    this.loader=true;
    this.page = page
    this.getSellers()
  }

  loaderExport : boolean = false
  exportToExcel(){
    this.loaderExport = true
    this.service.exportDeliveries(this.state ,  this.word).then((data : any) =>{
      this.loaderExport = false
      this.downloadFile(data.file);
    })
  }
  //exportCities
  downloadFile(data: string) {
    window.open(data);
  }

  edit(id){
    this.router.navigate(['/sellers/edit/' + id]);
  }
  editPassword(id){
    this.router.navigate(['/sellers/editPassword/' + id]);
  }
 
  isItems = false;
  id_deleted_Item;
  deleteLoader : boolean = false;

  ConfirmDataModal(confirmDataModalContent,id) {
    this.id_deleted_Item = id
    this.addModal = this.modal.open(confirmDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  delete(confirmForm)
  {
    this.deleteLoader = true;
    this.service.deleteSeller( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.isItems = false;
        this.getSellers()
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

    this.breadcrumb = {
      'mainlabel': 'Sellers Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول البائعين',
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
