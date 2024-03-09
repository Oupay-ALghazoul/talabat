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

  public basicCollapse2 = false;

  loader : boolean =true;
  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result ;

  activate = '';
  word = ''  ;
  special = '' ;
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
      this.permissionList.some((x) => x === "create_brand")
        ? (this.showAdd = true)
        : (this.showAdd = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_brand")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "delete_brand")
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
      special : [''],
    });
    this.getBrands()
  }
  getBrands(){
    // getAllCategories(paginated , page ,  status , word , activated )
    this.service.getBrands( 'true' , this.page , this.word  , this.activate ,  this.special )
    .then((data : any) =>{
      this.result = data.data;
      console.log( this.result)
      if(this.result.length != 0)
        this.isItems = true; 
      this.loader=false;
      this.loaderBtn = false ;
      this.total = data.total;
      let dev = (this.total / 10) >> 0;       
      let remain = this.total % 10;
      if(remain > 0)
      dev = dev + 1 ;
      this.collectionSize = dev * 10 ;   
      }, err => {
        this.loader=false;
        this.loaderBtn = false ;
        this.toastr.error(err.error)
      });
  }
  get f() {
    return this.search.controls;
  }
  searchBtn(){
    this.loaderBtn = true ;
    this.page = 1 ;
    this.word =  this.f.word.value; 
    this.activate =  this.f.activated.value; 
    this.special = this.f.special.value;
    this.isItems = false;
    this.loader=true;
    this.getBrands()
  }
  onPageChange(page)
  {
    this.loader = true 
    this.page = page
    this.getBrands()
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
      'mainlabel': 'Brands Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول الماركات',
    };

  }
  change_special( row , event) {
    console.log(event);
    console.log(row);
    var new_value ;

    (<HTMLInputElement>document.getElementById("loader_special" + row.id )).hidden = false;
    (<HTMLInputElement>document.getElementById("special_id" + row.id )).hidden = true;
    if(event == true){
      new_value = 1
    }else{
      new_value = 0
    }
    const newItem = {
      "special": new_value
    }

    console.log(newItem)
    this.service.updateBrandPartial( row.id  , newItem).then(
      res=> {
        (<HTMLInputElement>document.getElementById("loader_special" + row.id )).hidden = true;
        (<HTMLInputElement>document.getElementById("special_id" + row.id)).hidden = false;
        this.toastr.success(this.translate.instant('msg.changeCountryState'))

    },err => {
      (<HTMLInputElement>document.getElementById("loader_special" + row.id )).hidden = true;
      (<HTMLInputElement>document.getElementById("special_id" + row.id )).hidden = false;
      this.toastr.error(err)
    })
  }

  loaderExport : boolean = false
  exportToExcel(){
    this.loaderExport = true
    // this.service.exportMealCategories(this.word  , this.activate ).then((data : any) =>{
    //   this.loaderExport = false
    //   this.downloadFile(data.file);
    // })
  }
  downloadFile(data: string) {
    window.open(data);
  }

  edit(id)
  {    
    this.router.navigate(['/brands/edit/' + id]);
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
    this.service.deleteBrand( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.getBrands()
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
