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

  public breadcrumb: any;
  public breadcrumbAr :any;

  loader : boolean =true;
  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result ;

  activate = '';
  word = ''  
  loaderBtn : boolean =  false;

  arabic : boolean;

  search : FormGroup;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;
  showAdd : boolean ;
  showDelete : boolean

  constructor( private router: Router,  private modal: NgbModal, private user: UserServiceService  ,
    private formBuilder: FormBuilder , public service : Constant ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
     // permission add
     if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_association")
        ? (this.showAdd = true)
        : (this.showAdd = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_association")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "delete_association")
        ? (this.showDelete = true)
        : (this.showDelete = false);
    }
    if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showEdit = true;
      this.showAdd = true;
      this.showDelete = true
    }
    this.search = this.formBuilder.group({
      activated : [''] ,
      word: [''],
    });
    this.getAssociation()

  }
  getAssociation() {
    this.service.getAssociation().then((data : any) =>{
      this.result = data;
      console.log( this.result)
      if(this.result.length != 0)
        this.isItems = true; 
      this.loader = false ;
      })
  }
 
  get f() {
    return this.search.controls;
  }
  searchBtn(){
    this.loaderBtn = true ;
    this.page = 1 ;
    this.word =  this.f.word.value; 
    this.activate =  this.f.activated.value; 
    this.isItems = false;
    this.loader=true;
    // this.getBrands()
  }
  onPageChange(page)
  {
    this.loader = true 
    this.page = page
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
  ngOnInit() {

    this.breadcrumb = {
      'mainlabel': 'Product Associations Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول  ارتباطات المنتج',
    };

  }


  edit(id)
  {    
    this.router.navigate(['/association/edit/' + id]);
  }
  isItems = false;
  id_deleted_Item;
  addModal = null;
  ConfirmDataModal(confirmDataModalContent,id) {
    this.id_deleted_Item = id
    this.addModal = this.modal.open(confirmDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  deleteLoader : boolean = false;

  delete(confirmForm)
  {
    this.deleteLoader = true; 
    this.service.deleteAssociation( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.getAssociation()
    },err => {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.toastr.error(err)
    })
  }
  close(confirmForm){
    this.addModal.close(confirmForm.resetForm);
  }
}
