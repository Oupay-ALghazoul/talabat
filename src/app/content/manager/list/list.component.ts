import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TableApiService } from 'src/app/_services/table-api.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Country } from 'src/app/models/Country';

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

  addModal = null;
  search : FormGroup;

  public basicCollapse1 = false;
  public basicCollapse2 = false;

  loaderBtn : boolean =  false;
  state = '' ;
  word = '' ;
  role = '' ;
  phone = ''

  constructor( private router: Router,  private modal: NgbModal ,
    private formBuilder: FormBuilder , public service :Constant ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
    this.search = this.formBuilder.group({
      word_filter : [''],
      phone_filter  : [''] ,
      activated : [''] 
    });  

    this.getManagers()
  }
  getManagers(){
    this.service.getManager( 'true' , this.page, this.word ,this.state , this.phone ).then(
      (data : any ) =>{
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
      this.service.getAllCountriesMenu()
      .then((data : Country []) =>{
        console.log(data)
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
    this.getManagers()
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
    this.getManagers()
  }

  edit(id){
    this.router.navigate(['/manager/edit/' + id]);
  }
  editPassword(id){
    this.router.navigate(['/manager/editPassword/' + id]);
  }
  reset() {
    this.search = this.formBuilder.group({
      word_filter : [''],
      phone_filter  : [''] ,
      activated : [''] ,
    });
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
    this.service.deleteManager( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.getManagers()
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
      'mainlabel': 'Users Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول المستخدمين',
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
