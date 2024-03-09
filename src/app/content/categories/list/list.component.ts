import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from 'src/app/_services/user-service.service';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { AddComponent } from '../add/add.component';

//lang variables
let langCode;
let langId;


export class FileNode {
  sub_categories_recursive : FileNode[];
  name_ar : string  ;
  name_en : string  ;
  expanded: boolean;
}


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

  activate = '';
  word = ''  ;
  special = '' ;
  you_may_like = ''

  loaderBtn : boolean =  false;

  arabic : boolean;

  addForm : boolean = true
  editForm : boolean = false

  search : FormGroup;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;
  showAdd : boolean ;
  showDelete : boolean

  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  categories;

  public basicCollapse2 = false;

  constructor( private router: Router,  private modal: NgbModal, private user: UserServiceService  ,
    private formBuilder: FormBuilder , public service : Constant ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
     // permission add
     if( this.permissionList != null){
      this.permissionList.some((x) => x === "create_category")
        ? (this.showAdd = true)
        : (this.showAdd = false);
    }
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_category")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    //  permission delete
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "delete_category")
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
      you_may_like   : [''],
    });
    this.getCategories() ;
    this.updateMenu()
  }
  hasNestedChild = (_: number, nodeData: FileNode) => nodeData.sub_categories_recursive.length > 0;

  private _getChildren = (node: FileNode) => node.sub_categories_recursive;

  changeState(node) {
    node.expanded = !node.expanded;
    // console.log(node);
  }
  updateMenu(){
    this.service.getActiveAllCategories()
        .then((data : any []) =>{
           console.log(data)
           this.categories = data ;
           localStorage.setItem("all_categories", JSON.stringify(this.categories));
        })
  }
  getCategories(){
    this.service.getCategories(this.activate , this.word , this.special , this.you_may_like )
    .then((data : any) =>{
        this.result = data;    
        if(this.result.length != 0)
          this.isItems = true;
        console.log(data)
        this.createTree() ;
    
        
        this.loader = false;
        this.loaderBtn = false ;
      }, err => {
        this.loader=false;
        this.loaderBtn = false ;
        this.toastr.error(err.error)
      });
     
  }

  createTree(){   
    // let array : any [] = [];
    // for(let i =0 ; i< this.result.length ; i ++){
    //   array.push(this.result[i])
    // }
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.nestedDataSource.data = this.result
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
    this.you_may_like = this.f.you_may_like.value;
    this.isItems = false;
    this.loader=true;
    this.getCategories()
  }
  onPageChange(page)
  {
    this.loader = true 
    this.page = page
    this.getCategories()
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
  reset() {
    this.search = this.formBuilder.group({
      activated : [''] ,
      word: [''],
      special : [''],
      you_may_like   : [''],
    });
  }
  ngOnInit() {

    this.breadcrumb = {
      'mainlabel': 'Product Category Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول تصنيف المنتجات',
    };

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
    this.router.navigate(['/categories/edit/' + id]);
  }

  @ViewChild(AddComponent) child: AddComponent;
  currentItem = '';

  add(id) {
    console.log(id)
    this.currentItem = id ;
    console.log( this.currentItem )
    this.child.init()
  }

  isItems = false;
  id_deleted_Item;
  addModal = null;
  ConfirmDataModal(confirmDataModalContent,id) {
    this.id_deleted_Item = id
    console.log(id)
    this.addModal = this.modal.open(confirmDataModalContent, {
      windowClass: 'animated fadeInDown'
    });
  }
  deleteLoader : boolean = false;

  delete(confirmForm)
  {
    this.deleteLoader = true; 
    this.service.deleteCategory( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.getCategories()
        this.updateMenu()
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
