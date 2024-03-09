import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
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
export class ExtraListComponent implements OnInit {
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
  productId;
  word = '' ;
  loaderBtn : boolean =  false;
  isItems = false;

  addOptionForm : FormGroup

  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;
  showAdd : boolean ;
  showDelete : boolean ;

  constructor( private router: Router,  private modal: NgbModal, 
    private formBuilder: FormBuilder , public service : Constant , private route: ActivatedRoute,  private user: UserServiceService ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
     // permission add
     if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_meal")
        ? (this.showAdd = true)
        : (this.showAdd = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_meal")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    //  permission delete
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "delete_meal")
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
    });
    this.addOptionForm = this.formBuilder.group({
      title: ['' , Validators.required ],
      title_ar: ['' , Validators.required ],
      price: ['' , Validators.required ]
    });
    this.productId = this.route.snapshot.params['id'];
    this.getAllExtra()
  }
  getAllExtra(){
    this.service.getProductExtra( this.productId , 'true' , this.page , this.word ).then((data : any) =>{
      this.result = data.data;
      console.log(data)
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
      this.isItems = false;
      this.loader=false; 
    });
  }
  onPageChange(page)
  {
    this.page = page ;
    this.loader = true ;
    this.getAllExtra()
  }
 
  get f() {
    return this.search.controls;
  }
  searchBtn(){
    this.loaderBtn = true ;
    this.word =  this.f.word_filter.value; 
    this.isItems = false;
    this.page = 1 ;
    this.loader=true;
    this.getAllExtra()
  }

  edit(id)
  {    
    this.router.navigate(['/products/editExtra/' + id]);
  }
  addExtra(){
    this.router.navigate(['/products/addExtra/' + this.productId ]);
  }
  id_deleted_Item;
  addModal = null;
  ConfirmDataModal(confirmDataModalContent,id) {
    this.id_deleted_Item = id
    this.addModal = this.modal.open(confirmDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  selectedOptions ;
  optionsModal ;
  emptyOptions : boolean = true
  showOptions(showDataModalContent,row) {
    console.log(row)
    this.emptyOptions =true;
    this.service.getProductExtraOption(row.id).then((data : any) =>{
      this.selectedOptions = data
      if( this.selectedOptions.length != 0)
        this.emptyOptions = false
      console.log(data)
      this.optionsModal = this.modal.open(showDataModalContent, {
        windowClass: 'animated fadeInDown'
      });
    })
  
   
  }
  addOptionModal = null;
  extraId;
  addOption(addOptionModalContent,row) {
    console.log(row)
    this.extraId = row.id
    this.addOptionModal = this.modal.open(addOptionModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  get g() {
    return this.addOptionForm.controls;
  }
  submitted : boolean = false
  addLoader : boolean = false
  addOptions(addOptionForm){
    console.log(addOptionForm)
    this.submitted = true;
    this.addLoader = true;
    var title =  this.g.title.value; 
    var title_ar = this.g.title_ar.value;
    var price = this.g.price.value;
    const newItem = {
      "extra_id" : "",
      "title" : "" ,
      "title_ar" : "" ,
      "price" : ""
    }
    newItem.title = title
    newItem.title_ar = title_ar
    newItem.price = price
    newItem.extra_id =  this.extraId 
 
    if (this.addOptionForm.invalid) {
      this.addLoader = false;
      return;
    }
    console.log(newItem)
    this.service.addProductExtraOption(newItem).then(
      res=> {
      this.addLoader = false;
      this.toastr.success(this.translate.instant('msg.addProductExtraOption'))
      this.closeAddOption(addOptionForm)

    },err => {
      this.addLoader = false;
      this.toastr.error(err)
    })
    
  }
  deleteLoader : boolean = false;

  deleteExtra(confirmForm)
  {
    this.deleteLoader = true; 
    this.service.deleteProductExtra( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.isItems = false
        this.getAllExtra()
    },err => {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.toastr.error(err)
    })
  }
  
   delete(id)
  {
    (<HTMLInputElement>document.getElementById("loader"+id)).hidden = false;
    (<HTMLInputElement>document.getElementById("delete"+id)).hidden = true;
    this.service.deleteProductExtraOption(id).then(
      res=> {
        this.toastr.success(this.translate.instant('msg.deleteProductExtraOption'))
        this.closeOptions()
    },err => {
      (<HTMLInputElement>document.getElementById("loader"+id)).hidden = true;
      (<HTMLInputElement>document.getElementById("delete"+id)).hidden = false;
      this.toastr.error(err)
    })
    
  }
  closeAddOption(addOptionModal){
    this.addOptionForm.reset()
    this.addLoader = false;
    this.addOptionModal.close( addOptionModal.resetForm);
  }
  close(confirmForm){
    
    this.addModal.close(confirmForm.resetForm);
  }
  closeOptions(){
    this.optionsModal.close();

  }
  ngOnInit() {
   
    this.breadcrumb = {
      'mainlabel': 'Extra Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول الاكسترا',
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
  loaderExport : boolean = false
  exportToExcel(){
    this.loaderExport = true
    // this.service.exportMealExtras(this.productId ,  this.word).then((data : any) =>{
    //   this.loaderExport = false
    //   this.downloadFile(data.file);
    // })
  }
  //exportCities
  downloadFile(data: string) {
    window.open(data);
  }
}
