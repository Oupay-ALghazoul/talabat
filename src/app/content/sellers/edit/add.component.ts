import { Component, OnInit, ViewChild, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router, ActivatedRoute } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { User_Seller } from 'src/app/models/User_Seller';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MapsAPILoader } from '@agm/core';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

let langId;
let formData;
let photo;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class EditComponent implements OnInit , OnDestroy {

  public breadcrumb: any; 
  public breadcrumbAr : any;
  submitted = false;

  editForm: FormGroup;
  loaderBtn = false;
  loader = true

  countries = [];
  cities

  param_id
  info : User_Seller 
  countryName 
  selected_city 
  image ;

  // map variables
  zoom: number;
  @BlockUI('basicMap') blockUIBasicMap: NgBlockUI;
  @BlockUI('mapEvents') blockUIMapEvents: NgBlockUI;
  lat = JSON.parse(localStorage.getItem('coords'))!=null?Number(JSON.parse(localStorage.getItem('coords')).lat):'';
  lng = JSON.parse(localStorage.getItem('coords'))!=null?Number(JSON.parse(localStorage.getItem('coords')).lng):'';
  private geoCoder;
  @ViewChild('search',{ static: false })
  public searchElementRef: ElementRef;
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	// preferredCountries: CountryISO[] = [CountryISO.Kuwait,CountryISO.SaudiArabia,CountryISO.Syria];
  preferredCountries : any [] =[]
  selectedCountryISO
  selectedCountryISONumber
  constructor(private formBuilder: FormBuilder,private service: Constant , 
     private router: Router ,    private route: ActivatedRoute,  private mapsAPILoader: MapsAPILoader, 
     private ngZone: NgZone ,
     private translate: TranslateService ,  private toastr: ToastrService , 
     private location: Location ) { 
      this.param_id =  this.route.snapshot.params['id']
      formData = new FormData();
      this.translateMethod();  
      this.getSellerById()
    }
    getSellerById(){
      console.log(this.param_id)
      this.service.getSellerById(this.param_id).then(
        (res : User_Seller)=> {
          this.info = res ;
          console.log(res);
          this.countries = JSON.parse(localStorage.getItem("all_countries"))
          this.countries.forEach((element : Country)  => {
            this.preferredCountries.push(element.code);
      
          });
          for(let i = 0 ; i <  this.countries.length ; i++){
            if(this.countries[i].id == this.info.city.country_id){
              this.selectedCountryISO = this.countries[i].code
              this.selectedCountryISONumber = this.countries[i].callingcode
            }
          }
          this.lat = Number(this.info.seller.latitude)
          this.lng = Number(this.info.seller.longitude)
          this.service.getCountryById(this.info.city.country_id).then(
            (data : Country)=> {
            this.cities = data.cities
            console.log(this.cities)
          })
          this.editForm = this.formBuilder.group({
            first_name : [this.info.first_name, Validators.required ],
            last_name : [this.info.last_name, Validators.required ],
            email: [this.info.email,[Validators.required, Validators.email] ],
            // password: ['',Validators.required ], 
            phone:  [this.info.phone?.substring(3) , [Validators.required , Validators.pattern('[0-9]+')]],   
            city_id:  [this.info.city_id,Validators.required ] ,
            countryName : [this.info.city.country_id] ,
            image : [] ,
            supplier_since : [this.info.seller.supplier_since.substring(0,10)  ,Validators.required ] ,
            corporation_name  : [this.info.seller.corporation_name,Validators.required ] ,
            description_en  : [this.info.seller.description_en],
            description_ar : [this.info.seller.description_ar] ,
            address_en : [this.info.seller.address_en] ,
            address_ar : [this.info.seller.address_ar] ,
            activated : [ this.info.activated == true ? "1" : "0", Validators.required ] 
          });
          this.countryName = this.info.city.country_id
          this.selected_city  = this.info.city_id
          console.log(this.info.city.country_id)
          this.image =  this.info.image.high_quality;
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
    var phone = this.f.phone.value;
    var city_id = this.f.city_id.value;
    var activated = this.f.activated.value ;

    var supplier_since = this.f.supplier_since.value ;
    var corporation_name = this.f.corporation_name.value ;
    var description_en = this.f.description_en.value ;
    var description_ar = this.f.description_ar.value ;
    var address_en = this.f.address_en.value ;
    var address_ar = this.f.address_ar.value ;

    const newItem  : {[k: string]: any} = {}
    newItem.first_name = first_name;   
    newItem.last_name = last_name;   
    newItem.email = email;   
    if (phone != null)
    newItem.phone = (this.f.phone.value.e164Number +"").substr(1);
    newItem.city_id = city_id;   
    newItem.activated = activated ;

    newItem.supplier_since = supplier_since;
    newItem.corporation_name = corporation_name ;
    newItem.description_en = description_en ;

    newItem.description_ar = description_ar;
    newItem.address_en = address_en ;
    newItem.address_ar = address_ar ;
    newItem.latitude = this.lat?.toString();
    newItem.longitude =  this.lng?.toString();

    if(photo != null)
    newItem.image = photo  

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
    console.log(newItem)
    this.service.updateSeller( this.param_id , newItem).then(
        res=> {
        this.loaderBtn = false;
         photo = null;
       this.toastr.success(this.translate.instant('msg.editSeller'));
        setTimeout(() => 
          {
            this.router.navigate(['/sellers/list']);
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
      'mainlabel': 'Edit Seller Info',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/sellers/list'
        },
    
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل معلومات البائع',
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
