import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { Role } from 'src/app/models/Role';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

let langId;
let formData;
let langCode;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public breadcrumb: any; 
  public breadcrumbAr : any;
  submitted = false;

  addForm: FormGroup;
  loader = true;
  loaderBtn : boolean = false ;

  roles : Role [] ;
  countries = [];
  cities 
  countryName 
  selected_city

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	// preferredCountries: CountryISO[] = [CountryISO.Kuwait,CountryISO.SaudiArabia,CountryISO.Syria];
  preferredCountries : any [] =[]
  constructor(private formBuilder: FormBuilder,private service: Constant , 
     private router: Router ,
     private translate: TranslateService ,  private toastr: ToastrService , 
     private location: Location ) { 

      formData = new FormData();
      this.translateMethod();
      this.service.getAllRolesMenu().then((data : Role [] )=>{
        this.roles = data;
        this.loader = false ;
      })
      this.addForm = this.formBuilder.group({
        first_name : ['', Validators.required ],
        last_name : ['', Validators.required ],
        email: ['',[Validators.required, Validators.email] ],
        password: ['',Validators.required ], 
        phone:  [null ],
        city_id:  ['',Validators.required ] ,
        countryName : ['' ,Validators.required ] ,
        role_id : ['' , Validators.required ] ,
        photo : []
      });
      this.countries = JSON.parse(localStorage.getItem("all_countries"))
      console.log( this.countries)
      this.countries.forEach((element : Country)  => {
        this.preferredCountries.push(element.code);
  
      });
    }


  get f() {
    return this.addForm.controls;
  }

  hide: boolean = true;

  myFunction() {
    this.hide = !this.hide;
  }
  chooseCity(selected_country){ 
    console.log(selected_country)
    this.service.getCountryById(selected_country).then(
      (data : Country)=> {
      this.cities = data.cities
      console.log(this.cities)
    })
  }
  submit()
  {
    this.loaderBtn = true;

    var first_name =  this.f.first_name.value; 
    var last_name =  this.f.last_name.value; 
    var email = this.f.email.value;
    var password = this.f.password.value;
    var phone = this.f.phone.value ;
    if (phone != null)
      phone = (this.f.phone.value.e164Number +"").substr(1);
    var city_id = this.f.city_id.value;
    var role_id = this.f.role_id.value;

    formData.append("first_name", first_name);    
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append ("phone" , phone)  
    formData.append("city_id", city_id);
    formData.append("role_id", role_id);

    this.submitted = true;
    if (this.addForm.invalid) {
      this.loaderBtn = false;
      return;
    }
    if(formData.get("image") == null )
    {
      this.toastr.warning(this.translate.instant('msg.uploadPhoto'))
       this.loaderBtn = false;
       return;
    }
    if (phone == null) {
      this.toastr.warning(this.translate.instant('msg.enterPhone'))
      this.loaderBtn = false;
      return;
    }
    formData.forEach((value,key) => {
      console.log(key+value)
       });
    this.service.addManager(formData).then(
        res=> {
        this.loaderBtn = false;
        this.toastr.success(this.translate.instant('msg.addManager'));
        setTimeout(() => 
          {
            this.router.navigate(['/manager/list']);
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
    // Array.from(files).forEach(f => {
    //   formData.append('image',f)}) ;  
    //   this.preview()
    this.fileData = files[0];
    this.reader.readAsDataURL(this.fileData);
    
    this.reader.onload = function(){ 
     var photo = this.result;
      formData.append("image", photo);
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



  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'Add User',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/manager/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة مستخدم',
      'links': [
        {
         'name': 'القائمة السابقة' ,
          'isLink': true,
          'link': '/manager/list'
        },
    
      ]
    };
  }
  arabic : boolean;

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

  cancel()
  {
    this.location.back();
  }

}
