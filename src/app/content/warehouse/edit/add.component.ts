import { Component, OnInit, ViewChild, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Router, ActivatedRoute } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { Warehouse } from 'src/app/models/Warehouse';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MapsAPILoader } from '@agm/core';

let langId;
let formData;
let photo;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  public breadcrumb: any;
  public breadcrumbAr: any;
  submitted = false;

  editForm: FormGroup;
  loaderBtn = false;
  loader = true

  countries: Country;
  cities

  param_id
  info: Warehouse
  countryName
  selected_city
  image;

  // map variables
  zoom: number;
  @BlockUI('basicMap') blockUIBasicMap: NgBlockUI;
  @BlockUI('mapEvents') blockUIMapEvents: NgBlockUI;
  lat = JSON.parse(localStorage.getItem('coords')) != null ? Number(JSON.parse(localStorage.getItem('coords')).lat) : '';
  lng = JSON.parse(localStorage.getItem('coords')) != null ? Number(JSON.parse(localStorage.getItem('coords')).lng) : '';
  private geoCoder;
  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder, private service: Constant,
    private router: Router, private route: ActivatedRoute, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private translate: TranslateService, private toastr: ToastrService,
    private location: Location) {
    this.param_id = this.route.snapshot.params['id']
    formData = new FormData();
    this.translateMethod();

    this.getWarehouseById()
  }
  getWarehouseById() {
    console.log(this.param_id)
    this.service.getWarehouseById(this.param_id).then(
      (res: Warehouse) => {
        this.info = res;
        console.log(res);
        this.lat = Number(this.info.latitude)
        this.lng = Number(this.info.longitude)

        this.editForm = this.formBuilder.group({
          name_en: [ this.info.name_en , Validators.required],
          name_ar: [ this.info.name_ar , Validators.required],
          phone_number: [ this.info.phone_number , [Validators.required, Validators.pattern('[0-9]+')]],
          description_en: [ this.info.description_en ],
          description_ar: [ this.info.description_ar ],
          address: [ this.info.address ]
        });
        this.loader = false;
      })

  }

  get f() {
    return this.editForm.controls;
  }
 
  submit() {
    this.loaderBtn = true;

    var name_en =  this.f.name_en.value; 
    var name_ar =  this.f.name_ar.value; 
    var phone_number = this.f.phone_number.value;
    var description_en = this.f.description_en.value ;
    var description_ar = this.f.description_ar.value ;
    var address = this.f.address.value ;

    const newItem: { [k: string]: any } = {}
    newItem.name_en =  name_en;    
    newItem.name_ar =  name_ar;
    newItem.phone_number = phone_number ;
    newItem.description_en = description_en;
    newItem.description_ar = description_ar ;
    newItem.address = address;
    newItem.latitude = this.lat?.toString();
    newItem.longitude =  this.lng?.toString();

    this.submitted = true;
    if (this.editForm.invalid) {
      this.loaderBtn = false;
      return;
    }
    console.log(newItem)
    this.service.updateWarehouse(this.param_id, newItem).then(
      res => {
        this.loaderBtn = false;
        photo = null;
        this.toastr.success(this.translate.instant('msg.editWarehouse'));
        setTimeout(() => {
          this.router.navigate(['/warehouse/list']);
        },
          1000);
      }, err => {
        this.loaderBtn = false;
        this.toastr.error(err)
      })


  }

  ngOnDestroy() {
  }
  ngOnInit() {
    this.breadcrumb = {
      'mainlabel': 'Edit Warehouse',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/warehouse/list'
        },

      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل المخزن',
      'links': [
        {
          'name': 'القائمة السابقة',
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
    this.service.getPosition().then(pos => {
      this.lat = pos.lat;
      this.lng = pos.lng;

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
  arabic: boolean;

  translateMethod() {
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    let langCode = lang.split('"').join('');
    this.translate.use(langCode);
    console.log(langCode)
    let lang_id = localStorage.getItem("langId");
    langId = lang_id.split('"').join('');
    if (Number(langId) == 1) {
      this.arabic = true;

    } else {
      this.arabic = false;
    }
  }

  cancel() {
    this.location.back();
  }

}
