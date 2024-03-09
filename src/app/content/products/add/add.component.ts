import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/Category';
import { Brand } from 'src/app/models/Brand'
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { FormArray, FormGroup, FormControl } from '@angular/forms'
import { MapsAPILoader } from '@agm/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Attribute } from 'src/app/models/Attribute';
import { OutOfStock } from 'src/app/models/OutOfStock';
import { AvailableDeliveryOption } from 'src/app/models/AvailableDeliveryOption';
import { Association } from 'src/app/models/Association';
import { Product } from 'src/app/models/Product';
import { Payment } from 'src/app/models/Payment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User_Seller } from 'src/app/models/User_Seller';
import { UserServiceService } from 'src/app/_services/user-service.service';

declare const google: any;

let langCode;
let langId;
let formData;
let photo;
let photo_size;
let base_image;


export class FileNode {
  sub_categories_recursive: FileNode[];
  name_ar: string;
  name_en: string;
  expanded: boolean;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit, OnDestroy {
  public breadcrumb: any;
  public breadcrumbAr: any;
  arabic: boolean;

  submitted = false;
  submitted2 = false;
  submitted7 = false;
  submitted5 = false;
  submitted6 = false;
  submitted8 = false;
  submitted9 = false;

  public basicCollapse1 = false;
  public basicCollapse2 = true;

  today = new Date();
  format_date

  // forms
  detailsForm: FormGroup;
  inventoryForm: FormGroup;
  mediaForm: FormGroup;
  categoryForm: FormGroup;
  offerForm: FormGroup;
  discountForm: FormGroup;
  colorForm: FormGroup;
  attributesForm: FormGroup;
  associationForm: FormGroup;
  addOptionForm: FormGroup;
  addStockForm: FormGroup;

  attrForm: FormGroup;
  attr_items: FormArray;

  categories: Category[];
  brands: Brand[];
  attributes_list: Attribute[];
  outOfStocks: OutOfStock[];
  deliveryOptions: AvailableDeliveryOption[]
  associations: Association[]
  products: Product[]
  payments: Payment[]
  sellers: User_Seller[]

  loader: boolean = true;
  loader_btn: boolean = false

  // show forms variables
  details: boolean = true
  inventory: boolean = false
  media: boolean = false
  category: boolean = false
  offer: boolean = false
  discount: boolean = false
  color: boolean = false
  attributes: boolean = false
  association: boolean = false

  // color variables
  color1 = '';
  previewUrl: any = null;
  fileData: File = null;

  // arrays
  keywords_array_en: string[] = []
  keywords_array_ar: string[] = []
  tags_array: string[] = []
  seo_array: string[] = []
  public imagesArray = [];
  categories_array: Number[] = []
  color_array
  size_array: any[] = [];
  selectedAttributesIds: number[] = []
  selectedAttributes: any[] = [];
  attributes_array: any[] = [];

  selectedAssociationIds: number[] = []
  selectedAssociations: any[] = [];
  ssociations_array: any[] = [];

  selectedOption
  selectedPayment

  // arry dynamic
  array: any[] = ["one"];
  array_ar: any[] = ["one"];
  array_tags: any[] = ["one"];
  array_seo: any[] = ["one"];
  array_color: any[] = ["one"];
  array_size: any[] = ["one"];
  array_att: any[] = [];

  // map variables
  zoom: number;
  @BlockUI('basicMap') blockUIBasicMap: NgBlockUI;
  @BlockUI('mapEvents') blockUIMapEvents: NgBlockUI;
  lat = JSON.parse(localStorage.getItem('coords')) != null ? Number(JSON.parse(localStorage.getItem('coords')).lat) : '';
  lng = JSON.parse(localStorage.getItem('coords')) != null ? Number(JSON.parse(localStorage.getItem('coords')).lng) : '';
  private geoCoder;
  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;

  // tree
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  hasNestedChild = (_: number, nodeData: FileNode) => nodeData.sub_categories_recursive.length > 0;

  private _getChildren = (node: FileNode) => node.sub_categories_recursive;
  changeState(node) {
    node.expanded = !node.expanded;
    // console.log(node);
  }
  createTree() {
    this.service.getActiveCategories()
      .then((data: any) => {
        this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
        this.nestedDataSource = new MatTreeNestedDataSource();
        this.nestedDataSource.data = data;
        this.loader = false
      })
  }
  showAddStock: boolean = false;
  showAddDeliveryOption: boolean = false;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );

  constructor(private formBuilder: FormBuilder, private service: Constant, private router: Router
    , private translate: TranslateService, private toastr: ToastrService, private cpService: ColorPickerService,
    private location: Location, private cd: ChangeDetectorRef, private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader, private modal: NgbModal, private user: UserServiceService,
    private ngZone: NgZone) {
    formData = new FormData();
    this.format_date = this.convertDatePickerTimeToMySQLTime(this.today);
    console.log(this.format_date)
    // permission add
    if (this.permissionList != null) {
      this.permissionList.some((x) => x === "create_outOfStock")
        ? (this.showAddStock = true)
        : (this.showAddStock = false);
    }
    //  permission update
    if (this.permissionList != null) {
      this.permissionList.some((x) => x === "create_deliveryOption")
        ? (this.showAddDeliveryOption = true)
        : (this.showAddDeliveryOption = false);
    }
    if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showAddStock = true;
      this.showAddDeliveryOption = true;

    }

    this.translateMethod();
    this.detailsForm = this.formBuilder.group({
      name_en: ['', [Validators.required]],
      name_ar: ['', [Validators.required]],
      short_description_en: [''],
      short_description_ar: [''],
      description_en: [''],
      description_ar: [''],
      meta_tag_title_en: ['', [Validators.required]],
      meta_tag_title_ar: ['', [Validators.required]],
      meta_tag_keywords_en: [''],
      meta_tag_keywords_ar: [''],
      code: ['', Validators.required],
      barcode: ['', Validators.required],
      activated: [true, Validators.required],
      tags: [''],
      seo: [''],
      sku: ['', Validators.required],
      price: ['', Validators.required],
      min_quantity: ['', Validators.required],
      max_quantity: [''],
      best_collection: [false, Validators.required],
      newly_added: [false, Validators.required],
      flash_deal: [false, Validators.required],
      selected: [false, Validators.required],
      brand_id: ['', Validators.required],
      location: ['', Validators.required],
      requires_shipping: [true, Validators.required],
      shipping_timing: ['', Validators.required],
      weight_class: ['', Validators.required],
      length_class: ['', Validators.required],
      weight: ['', Validators.required],
      width: ['', Validators.required],
      length: ['', Validators.required],
      height: ['', Validators.required],
      out_of_stock_id: ['', Validators.required],
      selectedOption: ['', Validators.required],
      availability_date: ['', Validators.required],
      sort: ['', Validators.required],
      required_points: ['', Validators.required],
      selectedPayment: ['', Validators.required],
      seller_id: [''],
      delivery_estimation: ['']
    });
    this.inventoryForm = this.formBuilder.group({
      quantity: ['', Validators.required],
      subtract_stock: [false],
    })
    this.mediaForm = this.formBuilder.group({
      video: [''],
    })
    this.categoryForm = this.formBuilder.group({
      categories: [''],
    })
    this.offerForm = this.formBuilder.group({
      price: [''],
      start_date: [''],
      end_date: [''],
    })
    this.discountForm = this.formBuilder.group({
      quantity: [''],
      price: [''],
      start_date: [''],
      end_date: [''],
    })
    this.colorForm = this.formBuilder.group({
      name_en: [''],
      name_ar: [''],
      hex: [''],
      image: ['']
    })
    this.attributesForm = this.formBuilder.group({
      selectedAttributesIds: ['']
    })
    this.associationForm = this.formBuilder.group({
      selectedAssociationIds: ['']
    })
    this.addOptionForm = this.formBuilder.group({
      name_en: ['', Validators.required],
      name_ar: ['', Validators.required],
      estimated_hours: ['', Validators.required],
      cost: ['', Validators.required]
    });
    this.addStockForm = this.formBuilder.group({
      name_en: ['', Validators.required],
      name_ar: ['', Validators.required]
    });
    this.getData();
  }
  getData() {
    this.service.getActiveBrand().then((data: Brand[]) => {
      this.brands = data;
      console.log(this.brands)
    })
    this.service.getAttribute().then((data: Attribute[]) => {
      this.attributes_list = data;
    })
    this.service.outOfStock().then((data: OutOfStock[]) => {
      this.outOfStocks = data;
    })
    this.service.getDeliveryOption().then((data: AvailableDeliveryOption[]) => {
      this.deliveryOptions = data;
    })
    this.service.getAssociation().then((data: Association[]) => {
      this.associations = data;
    })
    this.service.getAllProductsMenu().then((data: Product[]) => {
      this.products = data;
      console.log(data)
    })
    this.service.getPayment().then((data: Payment[]) => {
      this.payments = data;
    })
    this.service.getAllSellersMenu().then((data: User_Seller[]) => {
      this.sellers = data;
      console.log(data)
    })

    this.createTree()
  }


  get f1() {
    return this.detailsForm.controls;
  }
  get f2() {
    return this.inventoryForm.controls;
  }
  get f3() {
    return this.mediaForm.controls;
  }
  get f4() {
    return this.categoryForm.controls;
  }
  get f5() {
    return this.offerForm.controls;
  }
  get f6() {
    return this.discountForm.controls;
  }
  get f7() {
    return this.colorForm.controls;
  }
  get f8() {
    return this.addOptionForm.controls;
  }
  get f9() {
    return this.addStockForm.controls;
  }
  // show methods
  showDetails(event) {
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "block");;

    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;

    this.details = true;
    this.inventory = false;
    this.media = false;
    this.category = false;
    this.offer = false;
    this.discount = false;
    this.color = false;
    this.attributes = false;
    this.association = false;
    this.add_class(event)
  }
  showCategory(event) {
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "block");;
    this.category = true;
    setTimeout(() => {
      for (let k = 0; k < this.categories_array.length; k++) {
        console.log(this.categories_array[k]);
        (<HTMLInputElement>document.getElementById("checked" + this.categories_array[k])).setAttribute('checked', 'checked');
      }
    },
      300);
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  showMedia(event) {
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "block");;
    this.category = false;
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  showDiscount(event) {
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "block");;
    this.category = false;
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  showOffers(event) {
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "block");;
    this.category = false;
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  showAttributes(event) {
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "block");;
    this.category = false;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  showColors(event) {
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "block");;
    this.category = false;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  showAssociations(event) {
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "block");;
    this.category = false;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  showInventory(event) {
    (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "block");;
    this.category = false;
    (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "none");;
    // (<HTMLInputElement>document.getElementById("category")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("attributes")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("association")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("media")).style.setProperty("display", "none");;
    (<HTMLInputElement>document.getElementById("color")).style.setProperty("display", "none");;
    this.add_class(event)
  }
  add_class(event) {
    event.preventDefault();
    event.target.parentElement.querySelectorAll(".active").forEach(e =>
      e.classList.remove("active"));
    setTimeout(() => {
      event.srcElement.classList.add("active");
    }, 0)
  }
  add(row, i) {
    this.array.push(row + i);
    // var keywords_en = (<HTMLInputElement>document.getElementById("keywords_en" + i )).value
    // this.properties[ "value" ] = (<HTMLInputElement>document.getElementById("value" + i )).value
    // this.keywords_array_en.push( keywords_en );
    // console.log(this.keywords_array_en);
    if (typeof this.keywords_array_en[i] === 'undefined') {
      this.keywords_array_en.push('');
    }
    if (this.array.length > 0) {

      (<HTMLInputElement>document.getElementById("plus" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus" + i)).hidden = false;
    }
  }
  remove(i) {
    // this.array = this.array.filter(item => item !== this.array[i])  ;
    console.log(i)
    this.array.splice(i, 1);
    this.keywords_array_en.splice(i, 1);
    // this.keywords_array_en = this.keywords_array_en.filter(item => item !==   this.keywords_array_en[i] )
    console.log(this.keywords_array_en);
    console.log(this.array);
  }
  change_keywords_en(i) {
    console.log(i)
    var keywords_en = (<HTMLInputElement>document.getElementById("keywords_en" + i)).value;
    if (typeof this.keywords_array_en[i] !== 'undefined') {
      console.info('exists');
      this.keywords_array_en[i] = keywords_en;
    } else {
      console.info('does not exist'); // incorrect!
      this.keywords_array_en.push(keywords_en);
    }
    console.log(keywords_en)
    console.log(this.keywords_array_en)
  }
  add_ar(row, i) {
    this.array_ar.push(row + i);
    // var keywords_ar = (<HTMLInputElement>document.getElementById("keywords_ar" + i )).value
    // this.properties[ "value" ] = (<HTMLInputElement>document.getElementById("value" + i )).value
    // this.keywords_array_ar.push( keywords_ar );
    // console.log(this.keywords_array_ar);
    if (typeof this.keywords_array_ar[i] === 'undefined') {
      this.keywords_array_ar.push('');
    }
    if (this.array_ar.length > 0) {
      (<HTMLInputElement>document.getElementById("plus_ar" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus_ar" + i)).hidden = false;
    }
  }
  remove_ar(i) {
    this.array_ar.splice(i, 1);
    this.keywords_array_ar.splice(i, 1);
    // this.array_ar = this.array_ar.filter(item => item !== this.array_ar[i])  
    // this.keywords_array_ar = this.keywords_array_ar.filter(item => item !==   this.keywords_array_ar[i] )
    console.log(this.keywords_array_ar);
  }
  change_keywords_ar(i) {
    console.log(i)
    var keywords_ar = (<HTMLInputElement>document.getElementById("keywords_ar" + i)).value;
    if (typeof this.keywords_array_ar[i] !== 'undefined') {
      console.info('exists');
      this.keywords_array_ar[i] = keywords_ar;
    } else {
      console.info('does not exist'); // incorrect!
      this.keywords_array_ar.push(keywords_ar);
    }
    console.log(keywords_ar)
    console.log(this.keywords_array_ar)
  }
  add_tag(row, i) {
    this.array_tags.push(row + i);
    // var tag = (<HTMLInputElement>document.getElementById("tag" + i )).value
    // this.tags_array.push( tag );
    // console.log(this.tags_array);
    if (typeof this.tags_array[i] === 'undefined') {
      this.tags_array.push('');
    }
    if (this.array_tags.length > 0) {
      (<HTMLInputElement>document.getElementById("plus_tag" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus_tag" + i)).hidden = false;
    }
  }
  remove_tag(i) {
    this.array_tags.splice(i, 1);
    this.tags_array.splice(i, 1);
    // this.array_tags = this.array_tags.filter(item => item !== this.array_tags[i])  
    // this.tags_array = this.tags_array.filter(item => item !==   this.tags_array[i] )
    console.log(this.tags_array);
  }
  change_tags(i) {
    console.log(i)
    var tag = (<HTMLInputElement>document.getElementById("tag" + i)).value;
    if (typeof this.tags_array[i] !== 'undefined') {
      console.info('exists');
      this.tags_array[i] = tag;
    } else {
      console.info('does not exist'); // incorrect!
      this.tags_array.push(tag);
    }
    console.log(tag)
    console.log(this.tags_array)
  }
  add_seo(row, i) {
    this.array_seo.push(row + i);
    // var seo = (<HTMLInputElement>document.getElementById("seo" + i )).value
    // this.seo_array.push( seo );
    // console.log(this.seo_array);
    if (typeof this.seo_array[i] === 'undefined') {
      this.seo_array.push('');
    }
    if (this.array_seo.length > 0) {
      (<HTMLInputElement>document.getElementById("plus_seo" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus_seo" + i)).hidden = false;
    }
  }
  remove_seo(i) {
    console.log(i)
    this.array_seo.splice(i, 1);
    this.seo_array.splice(i, 1);
    // this.array_seo = this.array_seo.filter(item => item !== this.array_seo[i])  
    // this.seo_array = this.seo_array.filter(item => item !==   this.seo_array[i] )
    console.log(this.seo_array);
  }
  change_seo(i) {
    console.log(i)
    var seo = (<HTMLInputElement>document.getElementById("seo" + i)).value;
    if (typeof this.seo_array[i] !== 'undefined') {
      console.info('exists');
      this.seo_array[i] = seo;
    } else {
      console.info('does not exist'); // incorrect!
      this.seo_array.push(seo);
    }
    console.log(seo)
    console.log(this.seo_array)
  }
  color_item = {
    "name_en": "",
    "name_ar": "",
    "hex": "",
    "image": ""
  };
  colorArray: any[] = [];
  add_color(row, i) {
    this.color_item = {
      "name_en": "",
      "name_ar": "",
      "hex": "",
      "image": ""
    };
    var name_color_en = (<HTMLInputElement>document.getElementById("name_color_en" + i)).value;
    var name_color_ar = (<HTMLInputElement>document.getElementById("name_color_ar" + i)).value;
    var hex = (<HTMLInputElement>document.getElementById("hex" + i)).value

    if (name_color_en == '' || name_color_ar == '') {
      this.toastr.warning(this.translate.instant('msg.enterColor'));
      return;
    }
    if (photo == null) {
      this.toastr.warning(this.translate.instant('msg.uploadPhoto'));
      return;
    }
    this.color_item["name_en"] = name_color_en;
    this.color_item["name_ar"] = name_color_ar;
    // this.color_item[ "hex" ] = this.color1 ;
    this.color_item["hex"] = hex;
    this.color1 = (<HTMLInputElement>document.getElementById("hex" + i)).value;
    this.color_item["image"] = photo;
    (<HTMLInputElement>document.getElementById("hex" + i)).style.backgroundColor = hex;

    this.array_color.push(row + i);
    this.colorArray.push(this.color_item);

    console.log(this.colorArray);
    console.log(this.color1);

    this.color1 = '';
    photo = null;
    this.color_item = {
      "name_en": "",
      "name_ar": "",
      "hex": "",
      "image": ""
    };
    (<HTMLInputElement>document.getElementById("plus_color" + i)).hidden = true;
    (<HTMLInputElement>document.getElementById("minus_color" + i)).hidden = false;
  }
  remove_color(i) {
    this.array_color.splice(i, 1);
    this.colorArray = this.colorArray.filter(item => item !== this.colorArray[i])
    console.log(this.array_color);
  }
  size_item = {
    "name": "",
    "image": ""
  }
  add_size(row, i) {
    var name_size = (<HTMLInputElement>document.getElementById("name_size" + i)).value;
    if (name_size == '') {
      this.toastr.warning(this.translate.instant('msg.enterSize'));
      return;
    }
    this.size_item["name"] = (<HTMLInputElement>document.getElementById("name_size" + i)).value;
    this.size_item["image"] = photo_size;
    this.size_array.push(this.size_item);
    this.array_size.push(row + i);
    console.log(this.size_array);
    this.size_item = {
      "name": "",
      "image": ""
    };
    photo_size = null;
    (<HTMLInputElement>document.getElementById("plus_size" + i)).hidden = true;
    (<HTMLInputElement>document.getElementById("minus_size" + i)).hidden = false;
  }
  remove_size(i) {
    this.array_size.splice(i, 1);
    // this.array_size = this.array_size.filter(item => item !== this.array_size[i])  
    this.size_array = this.size_array.filter(item => item !== this.size_array[i])
    console.log(this.size_array);
  }
  upload(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagesArray.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  deleteImage(img) {
    console.log(img)
    this.imagesArray = this.imagesArray.filter(item => item !== img)
    console.log(this.imagesArray)
  }

  add_node(event, id) {
    console.log(event)
    console.log(id)
    if (event == true) {
      this.categories_array.push(id);
    } else {
      this.categories_array = this.categories_array.filter(item => item !== id)
    }
    console.log(this.categories_array)
  }
  attribute_item = {
    "attribute_id": "",
    "value_en": "",
    "value_ar": ""
  }
  attSelected(event) {
    this.selectedAttributes = event;
    this.addItem()
    console.log(this.selectedAttributes)
  }
  change_value(item, i) {
    console.log(i)
    var value_en = (<HTMLInputElement>document.getElementById("value_en" + item.id)).value;
    var value_ar = (<HTMLInputElement>document.getElementById("value_ar" + item.id)).value;

    if (value_en == '' || value_ar == '') {
      this.toastr.warning(this.translate.instant('msg.enterValues'));
      return;
    }
    if (typeof this.attributes_array[i] !== 'undefined') {
      console.info('exists');
      // this.tags_array[i] = tag ;
      this.attribute_item["attribute_id"] = item.id;
      this.attribute_item["value_en"] = value_en;
      this.attribute_item["value_ar"] = value_ar;
      this.attributes_array[i] = this.attribute_item
      //  this.attributes_array.push( this.attribute_item );
    } else {
      console.info('does not exist'); // incorrect!
      this.attribute_item["attribute_id"] = item.id;
      this.attribute_item["value_en"] = value_en;
      this.attribute_item["value_ar"] = value_ar;
      this.attributes_array.push(this.attribute_item);
    }
    this.attribute_item = {
      "attribute_id": "",
      "value_en": "",
      "value_ar": ""
    };
    // (<HTMLInputElement>document.getElementById("plus_attr" + item.id )).hidden = true ;
    (<HTMLInputElement>document.getElementById("remove_attr" + item.id)).hidden = false;
    console.log(this.attributes_array)
  }
  delete_attr(item_del) {
    console.log(item_del)
    // console.log(this.selectedAttributes[].id )
    for (let k = 0; k < this.attributes_array.length; k++) {
      if (this.attributes_array[k].attribute_id == item_del.id) {
        this.attributes_array = this.attributes_array.filter(item => item !== this.attributes_array[k])
      }
    }
    this.selectedAttributes = this.selectedAttributes.filter(item => item !== item_del);
    this.selectedAttributesIds = this.selectedAttributesIds.filter(item => item !== item_del.id);
    console.log(this.selectedAttributes)
    console.log(this.attributes_array)

  }
  association_item = {
    "association_id": "",
    "products": []
  }
  asso_Selected(event) {
    this.selectedAssociations = event
    console.log(this.selectedAssociations)
  }
  product_list: any[] = []
  select_products(event, item, i) {
    this.product_list = event;
    console.log(event)
    this.save_asso(item, i)
  }
  save_asso(item, i) {
    if (this.product_list.length == 0) {
      this.toastr.warning(this.translate.instant('msg.selectProducts'));
      return;
    }

    if (typeof this.ssociations_array[i] !== 'undefined') {
      console.info('exists');
      this.association_item["association_id"] = item.id;
      var ids = []
      for (let k = 0; k < this.product_list.length; k++) {
        ids.push(this.product_list[k].id);
      }
      this.association_item["products"] = ids;

      this.ssociations_array[i] = this.association_item
      //  this.attributes_array.push( this.attribute_item );
    } else {
      console.info('does not exist'); // incorrect!
      this.association_item["association_id"] = item.id;
      var ids = []
      for (let k = 0; k < this.product_list.length; k++) {
        ids.push(this.product_list[k].id);
      }
      this.association_item["products"] = ids;
      this.ssociations_array.push(this.association_item);
    }

    this.association_item = {
      "association_id": "",
      "products": []
    }
    this.product_list = [];
    // (<HTMLInputElement>document.getElementById("plus_asso" + item.id )).hidden = true ;
    (<HTMLInputElement>document.getElementById("remove_asso" + item.id)).hidden = false;
    console.log(this.ssociations_array)
  }
  remove_asso(item_del) {
    console.log(item_del)
    // console.log(this.selectedAttributes[].id )
    for (let k = 0; k < this.ssociations_array.length; k++) {
      if (this.ssociations_array[k].association_id == item_del.id) {
        this.ssociations_array = this.ssociations_array.filter(item => item !== this.ssociations_array[k])
      }
    }
    this.selectedAssociations = this.selectedAssociations.filter(item => item !== item_del);
    this.selectedAssociationIds = this.selectedAssociationIds.filter(item => item !== item_del.id);
    console.log(this.selectedAssociations)
    console.log(this.ssociations_array)

  }
  upload_color(files: File[], i) {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = function () {
      photo = this.result
    };
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      (<HTMLInputElement>document.getElementById("colorReview" + i)).style.display = "block";
      (<HTMLInputElement>document.getElementById("colorReview" + i)).src = this.previewUrl;
    }
  }
  upload_size(files: File[], i) {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = function () {
      photo_size = this.result
    };
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      (<HTMLInputElement>document.getElementById("sizeReview" + i)).style.display = "block";
      (<HTMLInputElement>document.getElementById("sizeReview" + i)).src = this.previewUrl;
    }
  }
  upload_base_image(files: File[]) {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = function () {
      base_image = this.result
    };
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      (<HTMLInputElement>document.getElementById("base_image_review")).style.display = "block";
      (<HTMLInputElement>document.getElementById("base_image_review")).src = this.previewUrl;
    }
  }
  public onChangeColor(color: string): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    // this.colorArray.push(color);
    console.log(color)
    return this.cpService.rgbaToCmyk(rgba);
  }

  selectAllPayment() {
    this.selectedPayment = this.payments.map(x => x.id);
    console.log(this.selectedPayment)
  }
  unselectAllPayment() {
    this.selectedPayment = [];
    console.log(this.selectedPayment)
  }
  selectAllOptions() {
    this.selectedOption = this.deliveryOptions.map(x => x.id);
    console.log(this.selectedOption)
  }
  unselectAlOptions() {
    this.selectedOption = [];
    console.log(this.selectedOption)
  }
  submit() {
    this.loader_btn = true;
    console.log(this.imagesArray);

    (<HTMLInputElement>document.getElementById("tap-detials")).classList.remove("myclass");
    (<HTMLInputElement>document.getElementById("tap-category")).classList.remove("myclass");
    (<HTMLInputElement>document.getElementById("tap-discount")).classList.remove("myclass");
    (<HTMLInputElement>document.getElementById("tap-offer")).classList.remove("myclass");
    (<HTMLInputElement>document.getElementById("tap-inventory")).classList.remove("myclass");

    var requires_shipping = this.f1.requires_shipping.value
    if (requires_shipping == false) {
      console.log(requires_shipping)
      this.detailsForm.controls["shipping_timing"].setValidators(null);
      this.detailsForm.get("shipping_timing").updateValueAndValidity();

      this.detailsForm.controls["weight_class"].setValidators(null);
      this.detailsForm.get("weight_class").updateValueAndValidity();

      this.detailsForm.controls["length_class"].setValidators(null);
      this.detailsForm.get("length_class").updateValueAndValidity();

      this.detailsForm.controls["weight"].setValidators(null);
      this.detailsForm.get("weight").updateValueAndValidity();

      this.detailsForm.controls["length"].setValidators(null);
      this.detailsForm.get("length").updateValueAndValidity();

      this.detailsForm.controls["width"].setValidators(null);
      this.detailsForm.get("width").updateValueAndValidity();

      this.detailsForm.controls["height"].setValidators(null);
      this.detailsForm.get("height").updateValueAndValidity();

    } else {
      this.detailsForm.controls["shipping_timing"].setValidators(Validators.required);
      this.detailsForm.get("shipping_timing").updateValueAndValidity();

      this.detailsForm.controls["weight_class"].setValidators(Validators.required);
      this.detailsForm.get("weight_class").updateValueAndValidity();

      this.detailsForm.controls["length_class"].setValidators(Validators.required);
      this.detailsForm.get("length_class").updateValueAndValidity();

      this.detailsForm.controls["weight"].setValidators(Validators.required);
      this.detailsForm.get("weight").updateValueAndValidity();

      this.detailsForm.controls["length"].setValidators(Validators.required);
      this.detailsForm.get("length").updateValueAndValidity();

      this.detailsForm.controls["width"].setValidators(Validators.required);
      this.detailsForm.get("width").updateValueAndValidity();

      this.detailsForm.controls["height"].setValidators(Validators.required);
      this.detailsForm.get("height").updateValueAndValidity();
    }

    var name_en = this.f1.name_en.value;
    var name_ar = this.f1.name_ar.value;
    var short_description_en = this.f1.short_description_en.value;
    var short_description_ar = this.f1.short_description_ar.value;
    var description_en = this.f1.description_en.value;
    var description_ar = this.f1.description_ar.value;
    var meta_tag_title_en = this.f1.meta_tag_title_en.value;
    var meta_tag_title_ar = this.f1.meta_tag_title_ar.value;
    var code = this.f1.code.value;
    var barcode = this.f1.barcode.value;
    var activated = this.f1.activated.value;
    var sku = this.f1.sku.value;
    var price = this.f1.price.value;
    var min_quantity = this.f1.min_quantity.value;
    var max_quantity = this.f1.max_quantity.value;
    var best_collection = this.f1.best_collection.value;
    var newly_added = this.f1.newly_added.value;
    var flash_deal = this.f1.flash_deal.value;
    var selected = this.f1.selected.value;
    var brand_id = this.f1.brand_id.value;
    var location = this.f1.location.value;
    var out_of_stock_id = this.f1.out_of_stock_id.value;
    var seller_id = this.f1.seller_id.value;
    console.log(flash_deal == true ? "1" : "0")

    var requires_shipping = this.f1.requires_shipping.value;
    var shipping_timing = this.f1.shipping_timing.value;
    var weight_class = this.f1.weight_class.value;
    var length_class = this.f1.length_class.value;
    var weight = this.f1.weight.value;
    var width = this.f1.width.value;
    var length = this.f1.length.value;
    var height = this.f1.height.value;
    const dimensions = {
      "length": length,
      "width": width,
      "height": height
    }
    var availability_date = this.f1.availability_date.value;
    var sort = this.f1.sort.value;
    var delivery_estimation = this.f1.delivery_estimation.value;
    console.log(delivery_estimation)
    var required_points = this.f1.required_points.value;

    var quantity_inventory = this.f2.quantity.value;
    var subtract_stock = this.f2.subtract_stock.value;

    var video = this.f3.video.value;

    var price_offer = this.f5.price.value;
    var start_date_offer = this.f5.start_date.value;
    var end_date_offer = this.f5.end_date.value;

    if (price_offer == '' && start_date_offer == '' && end_date_offer == '') {
      this.offerForm.controls["price"].setValidators(null);
      this.offerForm.get("price").updateValueAndValidity();

      this.offerForm.controls["start_date"].setValidators(null);
      this.offerForm.get("start_date").updateValueAndValidity();

      this.offerForm.controls["end_date"].setValidators(null);
      this.offerForm.get("end_date").updateValueAndValidity();

    } else {
      this.offerForm.controls["price"].setValidators(Validators.required);
      this.offerForm.get("price").updateValueAndValidity();

      this.offerForm.controls["start_date"].setValidators(Validators.required);
      this.offerForm.get("start_date").updateValueAndValidity();

      this.offerForm.controls["end_date"].setValidators(Validators.required);
      this.offerForm.get("end_date").updateValueAndValidity();
    }

    var quantity = this.f6.quantity.value;
    var price_discount = this.f6.price.value;
    var start_date = this.f6.start_date.value;
    var end_date = this.f6.end_date.value;

    if (quantity == '' && price_discount == '' && start_date == '' && end_date == '') {
      this.discountForm.controls["quantity"].setValidators(null);
      this.discountForm.get("quantity").updateValueAndValidity();

      this.discountForm.controls["price"].setValidators(null);
      this.discountForm.get("price").updateValueAndValidity();

      this.discountForm.controls["start_date"].setValidators(null);
      this.discountForm.get("start_date").updateValueAndValidity();

      this.discountForm.controls["end_date"].setValidators(null);
      this.discountForm.get("end_date").updateValueAndValidity();
    } else {
      this.discountForm.controls["quantity"].setValidators(Validators.required);
      this.discountForm.get("quantity").updateValueAndValidity();

      this.discountForm.controls["price"].setValidators(Validators.required);
      this.discountForm.get("price").updateValueAndValidity();

      this.discountForm.controls["start_date"].setValidators(Validators.required);
      this.discountForm.get("start_date").updateValueAndValidity();

      this.discountForm.controls["end_date"].setValidators(Validators.required);
      this.discountForm.get("end_date").updateValueAndValidity();
    }
  
    this.submitted = true;
    this.submitted2 = true;
    this.submitted5 = true;
    this.submitted6 = true;

    if (this.detailsForm.invalid) {
      // (<HTMLInputElement>document.getElementById("details")).style.setProperty("display", "block");;
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.loader_btn = false;
      return;
    }
    if (short_description_en == '' || short_description_ar == '' || description_en == '' || description_ar == '') {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.warning(this.translate.instant('msg.enterDescription'));
      this.loader_btn = false;
      return;
    }
    this.keywords_array_en = this.keywords_array_en.filter(item => item !== "");
    console.log(this.keywords_array_en)
    if (this.keywords_array_en.length == 0) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.keywordsEn'));
      this.loader_btn = false;
      return;
    }
    this.keywords_array_ar = this.keywords_array_ar.filter(item => item !== "");
    console.log(this.keywords_array_ar)
    if (this.keywords_array_ar.length == 0) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.keywordsAr'));
      this.loader_btn = false;
      return;
    }
    this.tags_array = this.tags_array.filter(item => item !== "");
    console.log(this.tags_array)
    if (this.tags_array.length == 0) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.tags'));
      this.loader_btn = false;
      return;
    }
    this.seo_array = this.seo_array.filter(item => item !== "");
    console.log(this.seo_array)
    if (this.seo_array.length == 0) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.seo'));
      this.loader_btn = false;
      return;
    }
    if (this.categories_array.length == 0) {
      // this.category = true ;
      (<HTMLInputElement>document.getElementById("tap-category")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.category'));
      this.loader_btn = false;
      return;
    }
    if (this.inventoryForm.invalid) {
      (<HTMLInputElement>document.getElementById("tap-inventory")).classList.add("myclass");
      // (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "block");;
      this.loader_btn = false;
      return;
    }
    if (this.offerForm.invalid) {
      (<HTMLInputElement>document.getElementById("tap-offer")).classList.add("myclass");
      // (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "block");;
      this.loader_btn = false;
      return;
    }
    if (this.discountForm.invalid) {
      (<HTMLInputElement>document.getElementById("tap-discount")).classList.add("myclass");
      // (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "block");;
      this.loader_btn = false;
      return;
    }
    if (price_discount != '' && price_offer == '') {
      if (Number(price) - Number(price_discount) <= 0) {
        this.toastr.warning(this.translate.instant('msg.priceDiscount'));
        this.loader_btn = false;
        return;
      }
    }
    if (price_offer != '' && price_discount == '') {
      if (Number(price) - Number(price_offer) <= 0) {
        this.toastr.warning(this.translate.instant('msg.priceOffer'));
        this.loader_btn = false;
        return;
      }
    }
    if (price_discount != '' && price_offer != '') {
      if (Number(price) - (Number(price_discount) + Number(price_offer)) <= 0) {
        this.toastr.warning(this.translate.instant('msg.priceTotal'));
        this.loader_btn = false;
        return;
      }
    }
    const newItem = {
      "name_en": name_en,
      "name_ar": name_ar,
      "short_description_en": short_description_en,
      "short_description_ar": short_description_ar,
      "description_en": description_en,
      "description_ar": description_ar,
      "code": code,
      "barcode": barcode,
      "meta_tag_title_en": meta_tag_title_en,
      "meta_tag_title_ar": meta_tag_title_ar,
      "meta_tag_keywords_en": this.keywords_array_en,
      "meta_tag_keywords_ar": this.keywords_array_ar,
      "tags": this.tags_array,
      "seo": this.seo_array,
      "sku": sku,
      "location": location,
      "latitude": this.lat?.toString(),
      "longitude": this.lng?.toString(),
      "price": price,
      "quantity": quantity_inventory,
      "min_quantity": min_quantity,
      "max_quantity": max_quantity,
      "best_collection": best_collection == true ? 1 : 0,
      "newly_added": newly_added == true ? 1 : 0,
      "flash_deal": flash_deal == true ? 1 : 0,
      "selected": selected == true ? 1 : 0,
      "subtract_stock": subtract_stock,
      "shipping_timing": shipping_timing,
      "requires_shipping": requires_shipping == true ? "1" : "0",
      "availability_date": availability_date,
      "length_class": length_class,
      "dimensions": dimensions,
      "weight_class": weight_class,
      "weight": weight,
      "activated": activated,
      "sort": sort,
      "delivery_estimation": delivery_estimation,
      "video": video,
      // "image": this.imagesArray.length > 0 ? this.imagesArray[0] : "" ,
      // "images": this.imagesArray.length > 1 ? this.imagesArray.slice(1) : [] ,
      "image": base_image,
      "images": this.imagesArray,
      "required_points": required_points,
      "categories": this.categories_array,
      "brand_id": brand_id,
      "discount": null,
      "special_offer": null,
      "attributes": this.attributes_array,
      "associations": this.ssociations_array,
      "out_of_stock_id": out_of_stock_id,
      "seller_id": seller_id,
      "available_delivery_options": this.selectedOption,
      "available_payment": this.selectedPayment,
      "colors": this.colorArray,
      "sizes": this.size_array
    }

    if (price_offer != '' && start_date_offer != '' && end_date_offer != '') {
      if (start_date_offer > end_date_offer) {
        (<HTMLInputElement>document.getElementById("tap-offer")).classList.add("myclass");
        // (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "block");;
        this.toastr.info(this.translate.instant('msg.dateOffer'));
        this.loader_btn = false;
        return;
      }
      if( this.convertDatePickerTimeToMySQLTime(end_date_offer) < this.format_date ){
        (<HTMLInputElement>document.getElementById("tap-offer")).classList.add("myclass");
        // (<HTMLInputElement>document.getElementById("offer")).style.setProperty("display", "block");;
        this.toastr.info(this.translate.instant('msg.todayOffer'));
        this.loader_btn = false;
        return;
      }
      const product_special_offer = {
        "price": price_offer,
        "start_date": this.convertDatePickerTimeToMySQLTime(start_date_offer),
        "end_date": this.convertDatePickerTimeToMySQLTime(end_date_offer)
      }
      newItem.special_offer = product_special_offer;
    }

    if (quantity != '' && price_discount != '' && start_date != '' && end_date != '') {
      if (start_date > end_date) {
        (<HTMLInputElement>document.getElementById("tap-discount")).classList.add("myclass");
        // (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "block");;
        this.toastr.info(this.translate.instant('msg.dateDiscount'));
        this.loader_btn = false;
        return;
      }
      if( this.convertDatePickerTimeToMySQLTime(end_date) < this.format_date ){
        (<HTMLInputElement>document.getElementById("tap-discount")).classList.add("myclass");
        // (<HTMLInputElement>document.getElementById("discount")).style.setProperty("display", "block");;
        this.toastr.info(this.translate.instant('msg.todayDiscount'));
        this.loader_btn = false;
        return;
      }
      const discount = {
        "quantity": quantity,
        "price": price_discount,
        "start_date": this.convertDatePickerTimeToMySQLTime(start_date),
        "end_date": this.convertDatePickerTimeToMySQLTime(end_date)
      }
      newItem.discount = discount
    }
    console.log(newItem)
    this.service.addProduct(newItem).then(
      res => {
        this.loader_btn = false;
        this.toastr.success(this.translate.instant('msg.addProduct'))
        photo = null;
        photo_size = null;
        base_image = null;
        setTimeout(() => {
          this.router.navigate(['/products/list']);
        },
          1000);
      }, err => {
        this.loader_btn = false;
        this.toastr.error(err)
      })
  }
  convertDatePickerTimeToMySQLTime(str) {
    var month, day, year, hours, minutes, seconds;
    var date = new Date(str),
      month: any = ("0" + (date.getMonth() + 1)).slice(-2),
      day: any = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);

    var mySQLDate = [date.getFullYear(), month, day].join("-");
    var mySQLTime = [hours, minutes, seconds].join(":");
    return [mySQLDate, mySQLTime].join(" ");
  }
  ngOnInit() {
    photo = null;
    photo_size = null;
    base_image = null;

    this.breadcrumb = {
      'mainlabel': 'Add Product',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/products/list'
        }
      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'اضافة منتج',
      'links': [
        {
          'name': 'القائمة السابقة',
          'isLink': true,
          'link': '/products/list/'
        }
      ]
    };
    this.attrForm = new FormGroup({
      attr_items: new FormArray([])
    });

    this.getCurrentLocation();
    this.zoom = 15;

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
          this.zoom = 15;
        });
      });
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      value_en: ['', Validators.required],
      value_ar: ['', Validators.required]

    });
  }

  addItem(): void {
    console.log("add item")
    this.attr_items = this.attrForm.get('attr_items') as FormArray;
    console.log(this.attr_items)
    this.attr_items.push(this.createItem());
  }
  pointAt(index) {
    return (<FormArray>this.attrForm.get('attr_items')).at(index);
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
  translateMethod() {
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    langCode = lang.split('"').join('');
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
  loader8: boolean = false;
  addModal = null;

  ShowOptionModal(addOptionModal) {
    this.addModal = this.modal.open(addOptionModal, {
      windowClass: 'animated fadeInDown'
    });
  }
  submitOption(addOptionModal) {
    this.loader8 = true;

    var name_en = this.f8.name_en.value;
    var name_ar = this.f8.name_ar.value;
    var estimated_hours = this.f8.estimated_hours.value;
    var cost = this.f8.cost.value;

    const newItem = {
      "name_en": name_en,
      "name_ar": name_ar,
      "estimated_hours": estimated_hours,
      "cost": cost
    }

    this.submitted8 = true;
    if (this.addOptionForm.invalid) {
      this.loader8 = false;
      return;
    }
    console.log(newItem);

    this.service.addDeliveryOption(newItem).then(
      res => {
        this.loader8 = false;
        this.toastr.success(this.translate.instant('msg.addDeliveryOption'))
        this.service.getDeliveryOption().then((data: AvailableDeliveryOption[]) => {
          this.deliveryOptions = data;
        })
        this.addModal.close(addOptionModal);
        this.addOptionForm.reset();
        this.submitted8 = false;
      }, err => {
        this.loader8 = false;
        this.toastr.error(err)
      })
  }
  close(addOptionModal) {
    this.addModal.close(addOptionModal);
    this.addOptionForm.reset();
    this.submitted8 = false;
  }

  loader9: boolean = false;
  addModal2 = null;
  ShowStockModal(addStockModal) {
    this.addModal2 = this.modal.open(addStockModal, {
      windowClass: 'animated fadeInDown'
    });
  }

  submitStock(addStockModal) {
    this.loader9 = true;

    var name_en = this.f9.name_en.value;
    var name_ar = this.f9.name_ar.value;

    const newItem = {
      "name_en": name_en,
      "name_ar": name_ar
    }

    this.submitted9 = true;
    if (this.addStockForm.invalid) {
      this.loader9 = false;
      return;
    }

    this.service.addoutOfStock(newItem).then(
      res => {
        this.loader9 = false;
        this.toastr.success(this.translate.instant('msg.addOutOfStock'));
        this.service.outOfStock().then((data: OutOfStock[]) => {
          this.outOfStocks = data;
        })
        this.addModal2.close(addStockModal);
        this.addStockForm.reset();
        this.submitted9 = false;
      }, err => {
        this.loader9 = false;
        this.toastr.error(err)
      })


  }
  close2(addStockModal) {
    this.addModal2.close(addStockModal);
    this.addStockForm.reset();
    this.submitted9 = false;
  }
  ngOnDestroy() {
    photo = null;
    photo_size = null;
    base_image = null;
  }
}
