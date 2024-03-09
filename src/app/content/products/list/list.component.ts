import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { Category } from 'src/app/models/Category';
// import { ProductSubCategory } from 'src/app/models/ProductSubCategory';
import { Brand } from 'src/app/models/Brand'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from 'src/app/_services/user-service.service';

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

  loader : boolean =true;
  // for pagenation
  total:number = 0;
  collectionSize: number = 0;
  page = 1;
  result ;

  search : FormGroup;
  loaderBtn : boolean =  false;

  word = '' ;
  categoryId ='';
  state = '';
  brandId = '' ;
  code = '' ;
  flash_deal = '' ;
  best_collection  = '' ;
  newly_added  = '' ;
  selected = '' ;

  arabic : boolean;

  categories : Category [];
  brands : Brand [] ;

  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showExtraPermission : boolean ;
  showEdit : boolean ;
  showAdd : boolean ;
  showDelete : boolean ;

  public basicCollapse1 = false;
  public basicCollapse2 = false;

  constructor( private router: Router,  private modal: NgbModal, 
    private formBuilder: FormBuilder , public service : Constant ,
    private toastr: ToastrService , private translate: TranslateService , private user: UserServiceService) { 
    this.translateMethod();
    console.log( localStorage.getItem("permission-talabate"))
    // permission add
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_product")
        ? (this.showAdd = true)
        : (this.showAdd = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_product")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    //  permission delete
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "delete_product")
        ? (this.showDelete = true)
        : (this.showDelete = false);
    }
    //   showExtraPermission
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "view_product")
        ? (this.showExtraPermission = true)
        : (this.showExtraPermission = false);
    }
    if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showEdit = true;
      this.showAdd = true;
      this.showDelete = true;
      this.showExtraPermission = true
    }
    this.search = this.formBuilder.group({
      word : [''],
      code : [''] ,
      catId : [''],
      brandId : [''] ,
      activated : [''] ,
      flash_deal : [''] ,
      best_collection : [''] ,
      newly_added : [''] ,
      selected : [''] 
    });
    this.service.getActiveAllCategories()
    .then((data : Category []) =>{
       console.log(data)
       this.categories = data ;
    })
    this.service.getActiveBrand()
      .then((data : Brand []) =>{
        this.brands = data;
    })
    this.getProducts()
  }
 

  get f() {
    return this.search.controls;
  }
  searchBtn(){
    this.loaderBtn = true ;

    this.word =  this.f.word.value; 
    this.categoryId =  this.f.catId.value; 
    this.brandId =  this.f.brandId.value; 
    this.code = this.f.code.value;
    this.state = this.f.activated.value ;

    this.flash_deal =  this.f.flash_deal.value; 
    this.best_collection = this.f.best_collection.value;
    this.newly_added = this.f.newly_added.value ;
    this.selected = this.f.selected.value;

    this.page = 1 ;
    this.isItems = false;
    this.loader=true;
    this.getProducts()
  }
  reset() {
    this.search = this.formBuilder.group({
      word : [''],
      code : [''] ,
      catId : [''],
      brandId : [''] ,
      activated : [''] ,
      flash_deal : [''] ,
      best_collection : [''] ,
      newly_added : [''] ,
      selected : ['']
    });
  }
  getProducts(){
    // ( paginated , page , word )
    this.service.getAllProducts(  'true' , this.page , this.categoryId ,
    this.brandId , this.code ,  this.state , this.word , this.flash_deal , this.best_collection ,   this.newly_added , this.selected )
    .then((data : any) =>{
      this.result = data.data;
      console.log( data)
      if(this.result.length != 0)
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
        this.loaderBtn = false ;
        this.toastr.error(err.error)
      });
  }
  onPageChange(page)
  {
    this.loader=true;
    this.isItems = false;
    this.page = page ;
    this.getProducts()
  }
  showExtra(id)
  {    
    this.router.navigate(['/products/extraList/' + id]);
  }
  edit(id)
  {    
    this.router.navigate(['/products/edit/' + id]);
  }
  addProduct(){
    this.router.navigate(['/products/add' ]);
  }
  change_best_collection( row , event) {
    console.log(event);
    console.log(row);
    var new_value ;

    (<HTMLInputElement>document.getElementById("loader_best_collection" + row.id )).hidden = false;
    (<HTMLInputElement>document.getElementById("best_collection_id" + row.id )).hidden = true;
    if(event == true){
      new_value = 1
    }else{
      new_value = 0
    }
    const newItem = {
      "best_collection":new_value,
      // "newly_added":row.newly_added  == true ? 1 : 0 ,
      // "flash_deal": row.flash_deal  == true ? 1 : 0 ,
      // "selected" : row.selected == true ? 1 : 0 
    }

    console.log(newItem)
    this.service.updateBestCollection( row.id  , newItem).then(
      res=> {
        (<HTMLInputElement>document.getElementById("loader_best_collection" + row.id )).hidden = true;
        (<HTMLInputElement>document.getElementById("best_collection_id" + row.id)).hidden = false;
        this.toastr.success(this.translate.instant('msg.changeCountryState'))

    },err => {
      (<HTMLInputElement>document.getElementById("loader_best_collection" + row.id )).hidden = true;
      (<HTMLInputElement>document.getElementById("best_collection_id" + row.id )).hidden = false;
      this.toastr.error(err)
    })
  }
  change_newly_added( row , event) {
    console.log(event);
    console.log(row);
    var new_value ;

    (<HTMLInputElement>document.getElementById("loader_newly_added" + row.id )).hidden = false;
    (<HTMLInputElement>document.getElementById("newly_added_id" + row.id )).hidden = true;
    if(event == true){
      new_value = 1
    }else{
      new_value = 0
    }
    const newItem = {
      // "best_collection": row.best_collection == true ? 1 : 0 ,
      "newly_added": new_value,
      // "selected" : row.selected == true ? 1 : 0 ,
      // "flash_deal": row.flash_deal == true ? 1 : 0 
    }

    console.log(newItem)
    this.service.updateNewlyAdded( row.id  , newItem).then(
      res=> {
        (<HTMLInputElement>document.getElementById("loader_newly_added" + row.id )).hidden = true;
        (<HTMLInputElement>document.getElementById("newly_added_id" + row.id)).hidden = false;
        this.toastr.success(this.translate.instant('msg.changeCountryState'))

    },err => {
      (<HTMLInputElement>document.getElementById("loader_newly_added" + row.id )).hidden = true;
      (<HTMLInputElement>document.getElementById("newly_added_id" + row.id )).hidden = false;
      this.toastr.error(err)
    })
  }
  change_flash_deal( row , event) {
    console.log(event);
    console.log(row);
    var new_value ;

    (<HTMLInputElement>document.getElementById("loader_flash_deal" + row.id )).hidden = false;
    (<HTMLInputElement>document.getElementById("flash_deal_id" + row.id )).hidden = true;
    if(event == true){
      new_value = 1
    }else{
      new_value = 0
    }
    const newItem = {
      // "best_collection": row.best_collection == true ? 1 : 0 ,
      // "newly_added": row.newly_added == true ? 1 : 0 ,
      // "selected" : row.selected == true ? 1 : 0 ,
      "flash_deal": new_value
    }

    console.log(newItem)
    this.service.updateFlashDeals( row.id  , newItem).then(
      res=> {
        (<HTMLInputElement>document.getElementById("loader_flash_deal" + row.id )).hidden = true;
        (<HTMLInputElement>document.getElementById("flash_deal_id" + row.id)).hidden = false;
        this.toastr.success(this.translate.instant('msg.changeCountryState'))

    },err => {
      (<HTMLInputElement>document.getElementById("loader_flash_deal" + row.id )).hidden = true;
      (<HTMLInputElement>document.getElementById("flash_deal_id" + row.id )).hidden = false;
      this.toastr.error(err)
    })
  }
  change_selected( row , event) {
    console.log(event);
    console.log(row);
    var new_value ;

    (<HTMLInputElement>document.getElementById("loader_selected" + row.id )).hidden = false;
    (<HTMLInputElement>document.getElementById("selected_id" + row.id )).hidden = true;
    if(event == true){
      new_value = 1
    }else{
      new_value = 0
    }
    const newItem = {
      // "best_collection": row.best_collection == true ? 1 : 0 ,
      // "newly_added": row.newly_added == true ? 1 : 0 ,
      // "flash_deal": row.flash_deal == true ? 1 : 0  ,
      "selected" : new_value
    }

    console.log(newItem)
    this.service.updateSelected( row.id  , newItem).then(
      res=> {
        (<HTMLInputElement>document.getElementById("loader_selected" + row.id )).hidden = true;
        (<HTMLInputElement>document.getElementById("selected_id" + row.id)).hidden = false;
        this.toastr.success(this.translate.instant('msg.changeCountryState'))

    },err => {
      (<HTMLInputElement>document.getElementById("loader_selected" + row.id )).hidden = true;
      (<HTMLInputElement>document.getElementById("selected_id" + row.id )).hidden = false;
      this.toastr.error(err)
    })
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
    this.service.deleteProduct( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.getProducts() 
    },err => {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.toastr.error(err)
    })
  }
  close(confirmForm){
    this.addModal.close(confirmForm.resetForm);
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
      'mainlabel': 'Products Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول المنتجات',
    };

  }
  loaderExport : boolean = false
  exportToExcel(){
 
  }
  //exportCities
  downloadFile(data: string) {
    window.open(data);
  }
}
