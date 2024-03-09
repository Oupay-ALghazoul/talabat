import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Constant } from 'src/app/constant';
import { City } from 'src/app/models/city';
import { Country } from 'src/app/models/Country'
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
export class DetailsComponent implements OnInit {

  public breadcrumb: any;
  public breadcrumbAr :any;

  loader : boolean =true;
  
  country : Country ;
  active
  cities
  arabic : boolean;
  loaderBtn : boolean =  false;

  isItems : boolean = false;

  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean ;

  constructor( private router: Router,   private user: UserServiceService  ,
    public service : Constant ,  private route: ActivatedRoute,
    private toastr: ToastrService , private translate: TranslateService ) { 
    this.translateMethod();
  
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
    this.getDetails() 
 
  }
  getDetails() {
     this.service.getCountryById(this.route.snapshot.params['id']).then(
        (data : Country)=> {
        this.country = data ;
        console.log(this.country)
        this.cities = this.country.cities
        this.active = this.country.active
        if(this.cities.length != 0 )
          this.isItems = true
        this.loader=false;
      })  
  }

  state ;
  onChange( event) {
    console.log(event);
    (<HTMLInputElement>document.getElementById("loaderState")).hidden = false;
    (<HTMLInputElement>document.getElementById("change")).hidden = true;
    if(event == true){
      this.state = "1"
    }else{
      this.state = "0"
    }
    const newItem = {
      "active": this.state
    }

    console.log(newItem)
    this.service.updateCountry( this.country.id  , newItem).then(
      res=> {
        (<HTMLInputElement>document.getElementById("loaderState")).hidden = true;
        (<HTMLInputElement>document.getElementById("change")).hidden = false;
        this.toastr.success(this.translate.instant('msg.changeCountryState'))

      this.service.getAllCountriesMenu()
      .then((data : Country []) =>{
        console.log(data.length)
        localStorage.setItem("all_countries", JSON.stringify(data));
      })
    },err => {
      (<HTMLInputElement>document.getElementById("loaderState")).hidden = true;
      (<HTMLInputElement>document.getElementById("change")).hidden = false;
      this.toastr.error(err)
    })
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
      'mainlabel': 'Country Details',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/countries/list'
        },
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تفاصيل الدولة',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/countries/list'
        },
    
      ]
    };

  } 


  
}
