import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TableApiService } from 'src/app/_services/table-api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { Country } from 'src/app/models/Country';
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
  word = '' ;
  activated = '' ;
  arabic : boolean;

  search : FormGroup;
  addModal = null;
  loaderBtn : boolean =  false;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;

  constructor( private router: Router,  private user: UserServiceService ,
    private formBuilder: FormBuilder , public service :Constant ,   private modal: NgbModal ,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
    this.search = this.formBuilder.group({
      word: [''],
      activated : ['']
    });
   
    //  permission update
    if( this.permissionList != null){
      this.permissionList.some((x) => x === "update_country")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    
    if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showEdit = true;
    }
    this.getAllCountries() ;
  }
  getAllCountries(){
    this.service.getAllCountries( 'true' , this.page , this.word , this.activated )
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
  onPageChange(page)
  {
    this.loader = true 
    this.page = page
    this.getAllCountries()
  }
  loaderExport : boolean = false
  exportToExcel(){
    this.loaderExport = true
    this.service.exportCountries( this.word).then((data : any) =>{
      this.loaderExport = false
      this.downloadFile(data.file);
    })
  }
  //exportCities
  downloadFile(data: string) {
    window.open(data);
  }
  get f() {
    return this.search.controls;
  }
  searchBtn(){
    this.loaderBtn = true ;
    this.word = this.f.word.value; 
    this.activated = this.f.activated.value ;
    this.page = 1 ;
    this.isItems = false;
    this.loader=true;
    this.getAllCountries()
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
      'mainlabel': 'Country Table',
    };
    this.breadcrumbAr = {
      'mainlabel': 'جدول الدول',
    };

  } 

  showDetails(id)
  {    
    this.router.navigate(['/countries/details/' + id]);
  }
  state ;
  onChange( id , event) {
    console.log(event);
    (<HTMLInputElement>document.getElementById("loaderState" + id )).hidden = false;
    (<HTMLInputElement>document.getElementById("change" + id )).hidden = true;
    if(event == true){
      this.state = "1"
    }else{
      this.state = "0"
    }
    const newItem = {
      "active": this.state
    }

    console.log(newItem)
    this.service.updateCountry( id  , newItem).then(
      res=> {
        (<HTMLInputElement>document.getElementById("loaderState" + id )).hidden = true;
        (<HTMLInputElement>document.getElementById("change" + id )).hidden = false;
        this.toastr.success(this.translate.instant('msg.changeCountryState'))

      this.service.getAllCountriesMenu()
      .then((data : Country []) =>{
        console.log(data.length)
        localStorage.setItem("all_countries", JSON.stringify(data));
      })
      this.getAllCountries()
    },err => {
      (<HTMLInputElement>document.getElementById("loaderState" + id )).hidden = true;
      (<HTMLInputElement>document.getElementById("change" + id )).hidden = false;
      this.toastr.error(err)
    })
  }
  isItems = false;
  id_deleted_Item;

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
    this.service.deleteCountry( this.id_deleted_Item).then(
      res=> {
        this.deleteLoader = false;
        this.addModal.close(confirmForm.resetForm);
        this.loader = true;
        this.getAllCountries()
    },err => {
        this.toastr.error(err)
        this.deleteLoader = false; 
        this.addModal.close(confirmForm.resetForm); 
    })
  }
  close(confirmForm){
    this.addModal.close(confirmForm.resetForm);
  }
 
}
