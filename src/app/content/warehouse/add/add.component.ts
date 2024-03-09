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
        name_en : ['', Validators.required ],
        name_ar : ['', Validators.required ],
        phone_number :  ['', [Validators.required , Validators.pattern('[0-9]+')]],   
        description_en  : [''],
        description_ar : [''] ,
        address : [''] 
      });
    }


  get f() {
    return this.addForm.controls;
  }

  submit()
  {
    this.loader = true;

    var name_en =  this.f.name_en.value; 
    var name_ar =  this.f.name_ar.value; 
    var phone_number = this.f.phone_number.value;
    var description_en = this.f.description_en.value ;
    var description_ar = this.f.description_ar.value ;
    var address = this.f.address.value ;

    formData.append("name_en", name_en);    
    formData.append("name_ar", name_ar);
    formData.append ("phone_number" , phone_number)  
    formData.append("description_en", description_en);
    formData.append("description_ar", description_ar);
    formData.append("address", address);
    formData.append("latitude", this.lat?.toString());
    formData.append("longitude", this.lng?.toString());


    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader = false;
      return;
    }
    if (this.lat == '' || this.lng == '') {
      this.loader = false;
      if (Number(langId) == 1) {
        this.toastr.warning("حدد الموقع على الخريطة ");
      } else {
        this.toastr.warning('Please Select Location on the Map');
      }
      return;
    }
    formData.forEach((value,key) => {
      console.log(key+value)
       });
    this.service.addWarehouse(formData).then(
        res=> {
        this.loader = false;
       this.toastr.success(this.translate.instant('msg.addWarehouse'));
        setTimeout(() => 
          {
            this.router.navigate(['/warehouse/list']);
          },
          1000);
      },err => {
        this.loader = false;
        this.toastr.error(err)
      })
  }
  
 

ngOnInit() {
  this.breadcrumb = {
    'mainlabel': 'Add Warehouse',
    'links': [
      {
        'name': 'Previous List',
        'isLink': true,
        'link': '/warehouse/list'
      },
  
    ]
  };
  this.breadcrumbAr = {
    'mainlabel': 'اضافة مخزن',
    'links': [
      {
       'name': 'القائمة السابقة' ,
        'isLink': true,
        'link': '/warehouse/list'
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
