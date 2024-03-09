import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MapsAPILoader } from '@agm/core';
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
  loader = false;

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

  // map variables
  zoom: number;
  @BlockUI('basicMap') blockUIBasicMap: NgBlockUI;
  @BlockUI('mapEvents') blockUIMapEvents: NgBlockUI;
  lat = JSON.parse(localStorage.getItem('coords'))!=null?Number(JSON.parse(localStorage.getItem('coords')).lat):'';
  lng = JSON.parse(localStorage.getItem('coords'))!=null?Number(JSON.parse(localStorage.getItem('coords')).lng):'';
  private geoCoder;
  @ViewChild('search',{ static: false })
  public searchElementRef: ElementRef;
  
  constructor(private formBuilder: FormBuilder,private service: Constant , 
     private router: Router ,
     private translate: TranslateService ,  private toastr: ToastrService , 
     private location: Location , private mapsAPILoader: MapsAPILoader, 
     private ngZone: NgZone  ) { 

      formData = new FormData();
      this.translateMethod();
      this.addForm = this.formBuilder.group({
        first_name : ['', Validators.required ],
        last_name : ['', Validators.required ],
        email: ['',[Validators.required, Validators.email] ],
        // password: ['',Validators.required ], 
        phone:  [null],
        city_id:  ['',Validators.required ] ,
        countryName : ['' ,Validators.required ] ,
        image : [] ,
        supplier_since : ['' ,Validators.required ] ,
        corporation_name  : ['' ,Validators.required ] ,
        description_en  : [''],
        description_ar : [''] ,
        address_en : [''] ,
        address_ar : [''] 
      });
      this.countries = JSON.parse(localStorage.getItem("all_countries"))
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
    this.loader = true;

    var first_name =  this.f.first_name.value; 
    var last_name =  this.f.last_name.value; 
    var email = this.f.email.value;
    var phone = this.f.phone.value;
    var city_id = this.f.city_id.value;

    var supplier_since = this.f.supplier_since.value ;
    var corporation_name = this.f.corporation_name.value ;
    var description_en = this.f.description_en.value ;
    var description_ar = this.f.description_ar.value ;
    var address_en = this.f.address_en.value ;
    var address_ar = this.f.address_ar.value ;

    formData.append("first_name", first_name);    
    formData.append("last_name", last_name);
    formData.append("email", email);
    if (phone != null)
    phone = (this.f.phone.value.e164Number +"").substr(1);
    formData.append ("phone" , phone)  
    formData.append("city_id", city_id);

    formData.append("supplier_since", supplier_since);
    formData.append("corporation_name", corporation_name);
    formData.append("description_en", description_en);
    formData.append("description_ar", description_ar);
    formData.append("address_en", address_en);
    formData.append("address_ar", address_ar);
    formData.append("latitude", this.lat.toString() );
    formData.append("longitude", this.lng.toString());


    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
    if(formData.get("image") == null )
    {
      this.toastr.warning(this.translate.instant('msg.uploadPhoto'))
       this.loader = false;
       return;
    }
    if (phone == null) {
      this.toastr.warning(this.translate.instant('msg.enterPhone'))
      this.loader = false;
      return;
    }
    formData.forEach((value,key) => {
      console.log(key+value)
       });
    this.service.addSeller(formData).then(
        res=> {
        this.loader = false;
       this.toastr.success(this.translate.instant('msg.addSeller'));
        setTimeout(() => 
          {
            this.router.navigate(['/sellers/list']);
          },
          1000);
      },err => {
        this.loader = false;
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
    'mainlabel': 'Add Seller',
    'links': [
      {
        'name': 'Previous List',
        'isLink': true,
        'link': '/sellers/list'
      },
  
    ]
  };
  this.breadcrumbAr = {
    'mainlabel': 'اضافة بائع',
    'links': [
      {
       'name': 'القائمة السابقة' ,
        'isLink': true,
        'link': '/sellers/list'
      },
  
    ]
  };
  this.getCurrentLocation();
    this.zoom = 5;

    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 5;
        });
      });
    });
  }
  getCurrentLocation() {
    this.service.getPosition().then(pos=>
      {
         this.lat=pos.lat;
         this.lng=pos.lng;

      });
  }
  selectMarker(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }
  addMarker(lat: number, lng: number) {

    this.lat = lat;
    this.lng = lng;
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
