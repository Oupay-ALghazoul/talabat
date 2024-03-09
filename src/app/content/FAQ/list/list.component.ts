import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

export class ListComponent implements OnInit {

  arabic : boolean;
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

  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;
  showAdd : boolean ;
  showDelete : boolean ;

  constructor( private router: Router,  public service : Constant , private user: UserServiceService ,
    private formBuilder: FormBuilder ,    private modal: NgbModal ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
    // permission add
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_faq")
        ? (this.showAdd = true)
        : (this.showAdd = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_faq")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    //  permission delete
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "delete_faq")
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
      word_filter: [''],
    });
    this.getAllFaq()
  }
 
  getAllFaq(){
    this.service.getAllFAQs( 'true' , this.page , this.word).then((data : any) =>{
        this.result = data.data;
        console.log( data)     
        if( this.result.length != 0)     
          this.isItems = true;   
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
    this.getAllFaq()
  }
  onPageChange(page)
  {
    this.page = page;
    this.loader = true;
    this.getAllFaq()
  }
  edit(id)
  {    
    this.router.navigate(['/FAQs/edit/' + id]);
  }

  loaderExport : boolean = false
  exportToExcel(){
    this.loaderExport = true
    this.service.exportFAQs(this.word).then((data : any) =>{
      this.loaderExport = false
      this.downloadFile(data.file);
    })
  }
  //exportCities
  downloadFile(data: string) {
    window.open(data);
  }

  isItems = false;
  id_deleted_Item;
  addModal = null;
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
    this.service.deleteFAQ( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.isItems = false
        this.getAllFaq()
    },err => {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.toastr.error(err)
    })
  }
  close(confirmForm){
    this.addModal.close(confirmForm.resetForm);
  }
  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'FAQ Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول الأسئلة الشائعة ',
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
