import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router, ActivatedRoute } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { User } from '../../../models/User';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

let langId;
let formData;
let photo;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class EditComponent implements OnInit , OnDestroy{

  public breadcrumb: any; 
  public breadcrumbAr : any;
  submitted = false;

  editForm: FormGroup;
  loaderBtn = false;
  loader = true

  countries: any [];
  cities

  param_id
  info : User 
  countryName 
  selected_city ;

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	// preferredCountries: CountryISO[] = [CountryISO.Kuwait,CountryISO.SaudiArabia,CountryISO.Syria];
  preferredCountries : any [] =[]
  selectedCountryISO = CountryISO.Kuwait
  selectedCountryISONumber = '965'
  constructor(private formBuilder: FormBuilder,private service: Constant , 
     private router: Router ,    private route: ActivatedRoute, 
     private translate: TranslateService ,  private toastr: ToastrService , 
     private location: Location ) { 
      this.param_id =  this.route.snapshot.params['id']
      formData = new FormData();
      this.translateMethod();
     console.log(CountryISO.Kuwait)
      this.getUserProfile()
    }
    getUserProfile(){
      console.log(this.param_id)
      this.service.viewUserProfile(this.param_id).then(
        (res : User)=> {
          this.info = res ;
          console.log(res);
          this.countries = JSON.parse(localStorage.getItem("all_countries"))
          console.log(this.countries)
          
          this.countries.forEach((element : Country)  => {
            this.preferredCountries.push(element.code);
      
          });
          for(let i = 0 ; i <  this.countries.length ; i++){
            if(this.countries[i].id == this.info.city.country_id){
              this.selectedCountryISO = this.countries[i].code;
              this.selectedCountryISONumber = this.countries[i].callingcode
            }
          }
        
          console.log(this.selectedCountryISO)
          this.service.getCountryById(this.info.city.country_id).then(
            (data : Country)=> {
            this.cities = data.cities
            console.log(this.cities)
          })
          this.editForm = this.formBuilder.group({
            first_name : [ this.info.first_name, Validators.required ],
            last_name : [this.info.last_name , Validators.required ],
            email: [this.info.email ,[Validators.required, Validators.email] ],
            password: [''], 
            gender :  [this.info.gender ] ,
            birth_date :  [ this.info.birth_date == null ? '' : this.info.birth_date.substring(0,10) ] ,
            locale :  [this.info.locale ] ,
            activated : [ this.info.activated == true ? "1" : "0", Validators.required ] ,
            phone:  [this.info.phone?.substring(3) , [Validators.required]],   
            city_id:  [this.info.city_id,Validators.required ] ,
            photo : [],
            countryName : [this.info.city.country_id] ,
            verified : [this.info.verified , [Validators.required]],
            image_quality : [this.info.app_preference?.image_quality] ,
            orders  : [this.info.app_preference?.orders] ,
            emails  : [this.info.app_preference?.emails] ,
            promotions  : [this.info.app_preference?.promotions] ,
            others  : [this.info.app_preference?.others] ,
          });
          this.countryName = this.info.city.country_id
          this.selected_city  = this.info.city_id
          console.log(this.info.city.country_id)
          
          this.loader=false;
      })
      
    }
  
  get f() {
    return this.editForm.controls;
  }
  chooseCity(selected_country){ 
    console.log(selected_country)
    this.service.getCountryById(selected_country).then(
      (data : Country)=> {
      this.cities = data.cities
      console.log(this.cities)
    })
  }
  hide: boolean = true;

  myFunction() {
    this.hide = !this.hide;
  }

  submit()
  {
    this.loaderBtn = true;

    var first_name =  this.f.first_name.value; 
    var last_name =  this.f.last_name.value; 
    var email = this.f.email.value;
    var password = this.f.password.value;
    var city_id = this.f.city_id.value;
    var activated = this.f.activated.value

    var gender = this.f.gender.value;
    var birth_date = this.f.birth_date.value;
    var locale = this.f.locale.value;
    var verified = this.f.verified.value;

    var image_quality = this.f.image_quality.value;
    var orders = this.f.orders.value;
    var emails = this.f.emails.value;
    var promotions = this.f.promotions.value;
    var others = this.f.others.value;
    var phone = this.f.phone.value ;
    console.log(phone)
  
    const newItem  : {[k: string]: any} = {}
    newItem.first_name = first_name;   
    newItem.last_name = last_name;   
    newItem.email = email;  
    if (phone != null){
      newItem.phone = (this.f.phone.value.e164Number +"").substr(1);
      console.log((this.f.phone.value.e164Number +"").substr(1))
      console.log(newItem)
    }

    newItem.city_id = city_id;   
    newItem.activated = activated ;

    newItem.gender = gender;
    newItem.birth_date = birth_date ;
    newItem.locale = locale ;
    newItem.verified = verified ;
    
    newItem.image_quality = image_quality ;
    newItem.orders = orders ;
    newItem.emails = emails ;
    newItem.promotions = promotions ;
    newItem.others = others ;
   
    if(photo != null)
    newItem.image = photo

    if(password != '')
    newItem.password =  password;   

    this.submitted = true;
    if (this.editForm.invalid) {
      for (let el in this.editForm.controls) {
        if (this.editForm.controls[el].errors) {
          console.log(el)
        }
      }
      this.loaderBtn = false;
      return;
    }
    console.log(newItem)
    this.service.updateUser( this.param_id , newItem).then(
        res=> {
        this.loaderBtn = false;
        photo = null;
       this.toastr.success(this.translate.instant('msg.editUser'));
        setTimeout(() => 
          {
            this.router.navigate(['/users/list']);
          },
          1000);
      },err => {
        this.loaderBtn = false;
        this.toastr.error(err)
      })


  }
  
  previewUrl:any = null;
  fileData: File = null;
  reader = new FileReader();

  upload(files: File[]){
    this.fileData = files[0];
    this.reader.readAsDataURL(this.fileData);
    
    this.reader.onload = function(){ 
     photo = this.result;
     
      };   
      this.preview()
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
      
      (<HTMLInputElement>document.getElementById("imageReview")).style.display = "block";
      (<HTMLInputElement>document.getElementById("imageReview")).src =   this.previewUrl;
    }
}
ngOnDestroy() {
  photo = null;
} 
ngOnInit() {
  photo = null;
    this.breadcrumb = {
      'mainlabel': 'Edit Customers Info',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/users/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل معلومات العميل',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/users/list'
        },
    
      ]
    };
  }
  arabic : boolean;

  translateMethod(){
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    let langCode = lang.split('"').join('');
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

  cancel()
  {
    this.location.back();
  }

}
