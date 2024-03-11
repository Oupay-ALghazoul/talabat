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
import { isNullOrUndefined } from '@swimlane/ngx-datatable';
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
let photo_color_new;
let photo_size_new;
let base_image;

export class FileNode {
  sub_categories_recursive: FileNode[];
  name_ar: string;
  name_en: string;
  expanded: boolean;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
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

  categories: Category[];
  brands: Brand[];
  attributes_list: Attribute[];
  outOfStocks: OutOfStock[];
  deliveryOptions: AvailableDeliveryOption[]
  associations: Association[]
  products: Product[]
  payments: Payment[]
  sellers: User_Seller[]

  photo

  productId
  product: Product

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
  public imagesArray = [];
  categories_array: Number[] = []
  color_array: any[] = [];
  size_array: any[] = [];

  selectedAssociationIds: number[] = []
  selectedAssociations: any[] = [];

  selectedOption: number[] = [];
  selectedPayment: number[] = [];

  // old arrays
  associations_array: any[] = [];
  attributes_array: any[] = [];
  keywords_array_ar: string[] = []
  keywords_array_en: string[] = []
  tags_array: string[] = []
  seo_array: string[] = []

  // new array 
  keywords_array_en_new: string[] = []
  keywords_array_ar_new: string[] = []
  tags_array_new: string[] = []
  seo_array_new: string[] = []
  attributes_array_new: any[] = [];
  associations_array_new: any[] = [];

  // all  arrays
  association_array_all: any[] = [];
  attributes_array_all: any[] = [];
  keywords_array_en_all: string[] = [];
  keywords_array_ar_all: string[] = [];
  tags_array_all: string[] = []
  seo_array_all: string[] = []

  //  formatted
  attributes_array_formatted: any[] = [];
  association_array_formatted: any[] = [];

  // array dynamic
  array: any[] = ["one"];
  array_ar: any[] = ["one"];
  array_tags: any[] = ["one"];
  array_seo: any[] = ["one"];

  // color section variables
  color_item = {
    "name_en": "",
    "name_ar": "",
    "hex": "",
    "image": ""
  };
  loader_add_color: boolean = false;
  hex_new = '';

  // size section variables
  size_item = {
    "name": "",
    "image": ""
  }
  loader_add_size: boolean = false;

  // attributes variables 
  attribute_item = {
    "attribute_id": "",
    "value_en": "",
    "value_ar": ""
  }
  selectedAttributesIds: number[] = []
  selectedAttributes: any[] = [];

  public basicCollapse1 = false;
  public basicCollapse2 = true;
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
      })
  }

  showAddStock: boolean = false;
  showAddDeliveryOption: boolean = false;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  today = new Date();
  format_date

  constructor(private formBuilder: FormBuilder, private service: Constant, private router: Router
    , private translate: TranslateService, private toastr: ToastrService, private cpService: ColorPickerService,
    private location: Location, private cd: ChangeDetectorRef, private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader, private modal: NgbModal, private user: UserServiceService,
    private ngZone: NgZone) {
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
    formData = new FormData();
    this.translateMethod();
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
    this.productId = this.route.snapshot.params['id'];
    this.service.getProductById(this.productId).then((data: Product) => {
      console.log(data);
      this.product = data;
      this.getData();
      // var number2 = 1234.56789; // floating point example
      var myNumber = 1234.56789;

      console.log(myNumber.toFixed(3))
      this.detailsForm = this.formBuilder.group({
        name_en: [this.product.name_en, [Validators.required]],
        name_ar: [this.product.name_ar, [Validators.required]],
        short_description_en: [this.product.short_description_en],
        short_description_ar: [this.product.short_description_ar],
        description_en: [this.product.description_en],
        description_ar: [this.product.description_ar],
        meta_tag_title_en: [this.product.meta_tag_title_en, [Validators.required]],
        meta_tag_title_ar: [this.product.meta_tag_title_ar, [Validators.required]],
        meta_tag_keywords_en: [''],
        meta_tag_keywords_ar: [''],
        code: [this.product.code, Validators.required],
        barcode: [this.product.barcode, Validators.required],
        activated: [this.product.activated, Validators.required],
        tags: [''],
        seo: [''],
        sku: [this.product.sku, Validators.required],
        price: [Number(this.product.price).toFixed(3), Validators.required],
        min_quantity: [this.product.min_quantity, Validators.required],
        max_quantity: [this.product.max_quantity],
        best_collection: [this.product.best_collection, Validators.required],
        newly_added: [this.product.newly_added, Validators.required],
        flash_deal: [this.product.flash_deal, Validators.required],
        selected: [this.product.selected, Validators.required],
        brand_id: [this.product.brand_id, Validators.required],
        location: [this.product.location, Validators.required],
        requires_shipping: [this.product.requires_shipping, Validators.required],
        shipping_timing: [this.product.shipping_timing, Validators.required],
        weight_class: [this.product.weight_class, Validators.required],
        length_class: [this.product.length_class, Validators.required],
        weight: [this.product.dimensions.width, Validators.required],
        width: [this.product.dimensions.width, Validators.required],
        length: [this.product.dimensions.length, Validators.required],
        height: [this.product.dimensions.height, Validators.required],
        out_of_stock_id: [this.product.out_of_stock_id, Validators.required],
        selectedOption: ['', Validators.required],
        availability_date: [this.product.availability_date.substring(0, 10), Validators.required],
        sort: [this.product.sort, Validators.required],
        required_points: [this.product.required_points, Validators.required],
        selectedPayment: ['', Validators.required],
        seller_id: [this.product.seller_id],
        delivery_estimation: [this.product.delivery_estimation]
      });
      this.inventoryForm = this.formBuilder.group({
        quantity: [this.product.quantity, Validators.required],
        subtract_stock: [this.product.subtract_stock],
      })
      this.mediaForm = this.formBuilder.group({
        video: [this.product.video],
      })
      this.categoryForm = this.formBuilder.group({
        categories: [''],
      })
      
      this.offerForm = this.formBuilder.group({
        price: [this.product.special_offer != null ? Number(this.product.special_offer.price).toFixed(3) : ""],
        start_date: [this.product.special_offer != null ? this.product.special_offer.start_date : ""],
        end_date: [this.product.special_offer != null ? this.product.special_offer.end_date : ""],
      })
      this.discountForm = this.formBuilder.group({
        quantity: [this.product.discount != null ? this.product.discount.quantity : ""],
        price: [this.product.discount != null ? Number(this.product.discount.price).toFixed(3) : ""],
        start_date: [this.product.discount != null ? this.product.discount.start_date : ""],
        end_date: [this.product.discount != null ? this.product.discount.end_date : ""],
      })
      this.colorForm = this.formBuilder.group({
        name_en: ['', Validators.required],
        name_ar: ['', Validators.required],
        hex: [''],
        image: ['']
      })
      this.attributesForm = this.formBuilder.group({
        selectedAttributesIds: ['']
      })
      this.associationForm = this.formBuilder.group({
        selectedAssociationIds: ['']
      })
      this.product.available_delivery_options.forEach(element => {
        this.selectedOption.push(element.id);

      });
      this.product.available_payments.forEach(element => {
        this.selectedPayment.push(element.id);

      });
      this.product.categories.forEach(element => {
        this.categories_array.push(element.id);

      });

      this.attributes_array = this.product.attributes;
      this.attributes_array.forEach(element => {
        this.selectedAttributesIds.push(element.attribute_value.attribute_id);
      });
      this.color_array = this.product.colors;
      this.size_array = this.product.sizes;

      this.associations_array = this.product.associations;
      this.associations_array.forEach(element => {
        this.selectedAssociationIds.push(element.association_id);
      });

      this.lat = Number(this.product.latitude)
      this.lng = Number(this.product.longitude)
      this.photo = this.product.image;
      setTimeout(() => {
        if (this.photo != null) {
          if (!this.photo.high_quality.includes('default_image')) {
            (<HTMLInputElement>document.getElementById("del_base")).style.display = "block";
            (<HTMLInputElement>document.getElementById("base_image_review")).style.display = "block";
            (<HTMLInputElement>document.getElementById("base_image_review")).src = this.photo.high_quality;
          }
        }
      },
        300);


      if (this.product.images != null) {
        for (let i = 0; i < this.product.images.length; i++) {
          this.imagesArray.push(this.product.images[i]);
        }
      }
      this.keywords_array_en = this.product.meta_tag_keywords_en;
      this.keywords_array_ar = this.product.meta_tag_keywords_ar;
      this.tags_array = this.product.tags;
      this.seo_array = this.product.seo;

      this.loader = false
    })
  }

  getData() {
    this.createTree();
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
    })
    this.service.getPayment().then((data: Payment[]) => {
      this.payments = data;
    })
    this.service.getAllSellersMenu().then((data: User_Seller[]) => {
      this.sellers = data;
      console.log(data)
    })
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
  remove_offer() {
    this.product.special_offer = null;
    this.offerForm = this.formBuilder.group({
      price: [""],
      start_date: [""],
      end_date: [""],
    })
  }
  remove_discount() {
    this.product.discount = null;
    this.discountForm = this.formBuilder.group({
      quantity: [""],
      price: [""],
      start_date: [""],
      end_date: [""],
    })
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
  // keywords en
  add(row, i) {
    this.array.push(row + i);
    // var keywords_en = (<HTMLInputElement>document.getElementById("keywords_en_new" + i )).value
    // this.keywords_array_en_new.push( keywords_en );
    if (typeof this.keywords_array_en_new[i] === 'undefined') {
      this.keywords_array_en_new.push('');
    }
    if (this.array.length > 0) {
      (<HTMLInputElement>document.getElementById("plus_new" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus_new" + i)).hidden = false;
    }
  }
  remove_new(i) {
    this.array.splice(i, 1);
    this.keywords_array_en_new.splice(i, 1);
    // this.array = this.array.filter(item => item !== this.array[i])  
    // this.keywords_array_en_new = this.keywords_array_en_new.filter(item => item !==   this.keywords_array_en_new[i] )
  }
  remove(string) {
    this.keywords_array_en = this.keywords_array_en.filter(item => item !== string)
  }
  change_keywords_en_new(i) {
    console.log(i)
    var keywords_en = (<HTMLInputElement>document.getElementById("keywords_en_new" + i)).value;
    if (typeof this.keywords_array_en_new[i] !== 'undefined') {
      console.info('exists');
      this.keywords_array_en_new[i] = keywords_en;
    } else {
      console.info('does not exist'); // incorrect!
      this.keywords_array_en_new.push(keywords_en);
    }
    console.log(keywords_en)
    console.log(this.keywords_array_en_new)
  }
  // keywords ar
  add_ar(row, i) {
    this.array_ar.push(row + i);
    // var keywords_ar = (<HTMLInputElement>document.getElementById("keywords_ar_new" + i )).value
    // this.keywords_array_ar_new.push( keywords_ar );
    if (typeof this.keywords_array_ar_new[i] === 'undefined') {
      this.keywords_array_ar_new.push('');
    }
    if (this.array_ar.length > 0) {
      (<HTMLInputElement>document.getElementById("plus_ar_new" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus_ar_new" + i)).hidden = false;
    }
  }
  remove_ar_new(i) {
    this.array_ar.splice(i, 1);
    this.keywords_array_ar_new.splice(i, 1);
    // this.array_ar = this.array_ar.filter(item => item !== this.array_ar[i])  
    // this.keywords_array_ar_new = this.keywords_array_ar_new.filter(item => item !==   this.keywords_array_ar_new[i] )
  }
  remove_ar(string) {
    this.keywords_array_ar = this.keywords_array_ar.filter(item => item !== string)
  }
  change_keywords_ar_new(i) {
    console.log(i)
    var keywords_ar = (<HTMLInputElement>document.getElementById("keywords_ar_new" + i)).value;
    if (typeof this.keywords_array_ar_new[i] !== 'undefined') {
      console.info('exists');
      this.keywords_array_ar_new[i] = keywords_ar;
    } else {
      console.info('does not exist'); // incorrect!
      this.keywords_array_ar_new.push(keywords_ar);
    }
    console.log(keywords_ar)
    console.log(this.keywords_array_ar_new)
  }
  // tags
  add_tag(row, i) {
    this.array_tags.push(row + i);
    // var tag = (<HTMLInputElement>document.getElementById("tag_new" + i )).value
    // this.tags_array_new.push( tag );
    // console.log(this.tags_array_new);
    if (typeof this.tags_array_new[i] === 'undefined') {
      this.tags_array_new.push('');
    }
    if (this.array_tags.length > 0) {
      (<HTMLInputElement>document.getElementById("plus_tag_new" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus_tag_new" + i)).hidden = false;
    }
  }
  remove_tag_new(i) {
    console.log(i)
    this.array_tags.splice(i, 1);
    this.tags_array_new.splice(i, 1);
    // this.array_tags = this.array_tags.filter(item => item !== this.array_tags[i])  
    // this.tags_array_new = this.tags_array_new.filter(item => item !==   this.tags_array_new[i] )
    console.log(this.tags_array_new);
  }
  remove_tag(string) {
    this.tags_array = this.tags_array.filter(item => item !== string)
    console.log(this.tags_array);
  }
  change_tag_new(i) {
    console.log(i)
    var tag = (<HTMLInputElement>document.getElementById("tag_new" + i)).value;
    if (typeof this.tags_array_new[i] !== 'undefined') {
      console.info('exists');
      this.tags_array_new[i] = tag;
    } else {
      console.info('does not exist'); // incorrect!
      this.tags_array_new.push(tag);
    }
    console.log(tag)
    console.log(this.tags_array_new)
  }
  // seo
  add_seo(row, i) {
    this.array_seo.push(row + i);
    // var seo = (<HTMLInputElement>document.getElementById("seo_new" + i )).value
    // this.seo_array_new.push( seo );
    if (typeof this.seo_array_new[i] === 'undefined') {
      this.seo_array_new.push('');
    }
    if (this.array_seo.length > 0) {
      (<HTMLInputElement>document.getElementById("plus_seo_new" + i)).hidden = true;
      (<HTMLInputElement>document.getElementById("minus_seo_new" + i)).hidden = false;
    }
  }
  remove_seo_new(i) {
    this.array_seo.splice(i, 1);
    this.seo_array_new.splice(i, 1);
    // this.array_seo = this.array_seo.filter(item => item !== this.array_seo[i])  
    // this.seo_array_new = this.seo_array_new.filter(item => item !==   this.seo_array_new[i] )
  }
  remove_seo(i) {
    this.seo_array = this.seo_array.filter(item => item !== this.seo_array[i])
  }
  change_seo_new(i) {
    console.log(i)
    var seo_new = (<HTMLInputElement>document.getElementById("seo_new" + i)).value;
    if (typeof this.seo_array_new[i] !== 'undefined') {
      console.info('exists');
      this.seo_array_new[i] = seo_new;
    } else {
      console.info('does not exist'); // incorrect!
      this.seo_array_new.push(seo_new);
    }
    console.log(seo_new)
    console.log(this.seo_array_new)
  }
  // color
  add_color() {
    this.loader_add_color = true;
    var name_en = this.f7.name_en.value;
    var name_ar = this.f7.name_ar.value;

    this.submitted7 = true;

    if (this.colorForm.invalid) {
      this.loader_add_color = false;
      return;
    }
    if (photo_color_new == null) {
      this.toastr.warning(this.translate.instant('msg.uploadPhoto'));
      this.loader_add_color = false;
      return;
    }
    const newItem: { [k: string]: any } = {}
    newItem.name_en = name_en;
    newItem.name_ar = name_ar;
    newItem.hex = this.hex_new;
    newItem.image = photo_color_new
    newItem.product_id = Number(this.productId)

    console.log(newItem)

    this.service.addProductColor(newItem).then(
      res => {
        this.service.getProductById(this.productId).then((data: Product) => {
          this.color_array = data.colors;
        });
        this.loader_add_color = false;
        this.toastr.success(this.translate.instant('msg.addProductColor'));
        this.colorForm.reset();
        this.submitted7 = false;
        this.hex_new = '';
        (<HTMLInputElement>document.getElementById("colorReviewNew")).style.display = "none";
        photo_color_new = '';
      }, err => {
        this.loader_add_color = false;
        this.toastr.error(err)
      })
  }
  update_color(item) {
    (<HTMLInputElement>document.getElementById("loader_update_color" + item.id)).hidden = false;

    var name_color_en = (<HTMLInputElement>document.getElementById("name_color_en" + item.id)).value;
    var name_color_ar = (<HTMLInputElement>document.getElementById("name_color_ar" + item.id)).value;
    var hex = (<HTMLInputElement>document.getElementById("hex" + item.id)).value;

    if (name_color_en == '' || name_color_ar == '') {
      this.toastr.warning(this.translate.instant('msg.enterColor'));
      return;
    }
    const newItem: { [k: string]: any } = {}
    newItem.name_en = name_color_en;
    newItem.name_ar = name_color_ar;
    newItem.hex = hex;
    newItem.product_id = Number(this.productId);

    this.color1 = '';

    if (photo == null)
      newItem.image = item.image;
    else
      newItem.image = photo;

    console.log(newItem)
    this.service.updateProductColor(item.id, newItem).then(
      res => {
        this.service.getProductById(this.productId).then((data: Product) => {
          this.color_array = data.colors;
        });
        (<HTMLInputElement>document.getElementById("loader_update_color" + item.id)).hidden = true;
        this.toastr.success(this.translate.instant('msg.editProductColor'))
      }, err => {
        (<HTMLInputElement>document.getElementById("loader_update_color" + item.id)).hidden = true;
        this.toastr.error(err)
      })
  }
  delete_color(id) {
    (<HTMLInputElement>document.getElementById("loader_delete_color" + id)).hidden = false;
    this.service.deleteProductColor(id).then(
      res => {
        this.service.getProductById(this.productId).then((data: Product) => {
          this.color_array = data.colors;
        });
        (<HTMLInputElement>document.getElementById("loader_delete_color" + id)).hidden = true;
        this.toastr.success(this.translate.instant('msg.deleteProductColor'))
      }, err => {
        (<HTMLInputElement>document.getElementById("loader_delete_color" + id)).hidden = true;
        this.toastr.error(err)
      })
  }
  // size
  update_size(item) {
    (<HTMLInputElement>document.getElementById("loader_update_size" + item.id)).hidden = false;

    var name_size = (<HTMLInputElement>document.getElementById("name_size" + item.id)).value;
    if (name_size == '') {
      this.toastr.warning(this.translate.instant('msg.enterSize'));
      return;
    }
    const newItem: { [k: string]: any } = {}
    newItem.name = name_size;
    if (photo_size == null)
      newItem.image = item.image;
    else
      newItem.image = photo_size;
    newItem.product_id = Number(this.productId);

    console.log(newItem)
    this.service.updateProductSize(item.id, newItem).then(
      res => {
        this.service.getProductById(this.productId).then((data: Product) => {
          this.size_array = data.sizes;
        });
        (<HTMLInputElement>document.getElementById("loader_update_size" + item.id)).hidden = true;
        this.toastr.success(this.translate.instant('msg.editProductSize'));
      }, err => {
        (<HTMLInputElement>document.getElementById("loader_update_size" + item.id)).hidden = true;
        this.toastr.error(err)
      })
  }
  delete_size(id) {
    (<HTMLInputElement>document.getElementById("loader_delete_size" + id)).hidden = false;
    this.service.deleteProductSize(id).then(
      res => {
        this.service.getProductById(this.productId).then((data: Product) => {
          this.size_array = data.sizes;
        });
        (<HTMLInputElement>document.getElementById("loader_delete_size" + id)).hidden = true;
        this.toastr.success(this.translate.instant('msg.deleteProductSize'))
      }, err => {
        (<HTMLInputElement>document.getElementById("loader_delete_size" + id)).hidden = true;
        this.toastr.error(err)
      })
  }
  add_size() {
    this.loader_add_size = true;

    var name_size = (<HTMLInputElement>document.getElementById("name_size_new")).value;
    if (name_size == '') {
      this.toastr.warning(this.translate.instant('msg.enterSize'));
      this.loader_add_size = false;
      return;
    }
    const newItem: { [k: string]: any } = {}
    newItem.name = name_size;
    newItem.product_id = Number(this.productId)
    newItem.image = photo_size_new;
    console.log(newItem)

    this.service.addProductSize(newItem).then(
      res => {
        this.service.getProductById(this.productId).then((data: Product) => {
          this.size_array = data.sizes;
        });
        this.loader_add_size = false;
        this.toastr.success(this.translate.instant('msg.addProductSize'));
        (<HTMLInputElement>document.getElementById("name_size_new")).value = '';
        (<HTMLInputElement>document.getElementById("sizeReviewNew")).style.display = "none";
        photo_size_new = '';
      }, err => {
        this.loader_add_size = false;
        this.toastr.error(err)
      })

  }
  // images
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
      (<HTMLInputElement>document.getElementById("del_base")).style.display = "block";
      (<HTMLInputElement>document.getElementById("base_image_review")).src = this.previewUrl;
    }
  }
  deleteBaseImage() {
    base_image = null;
    this.photo = '';
    (<HTMLInputElement>document.getElementById("base_image_review")).style.display = "none";
    (<HTMLInputElement>document.getElementById("del_base")).style.display = "none";
  }
  // categories 
  add_node(event, id) {
    if (event == true) {
      this.categories_array.push(id);
    } else {
      this.categories_array = this.categories_array.filter(item => item !== id)
    }
  }

  attSelected(event) {
    // this.selectedAttributes = event;
    console.log(this.attributes_array)
    console.log(event)
    if (this.attributes_array.length > 0) {
      for (let i = 0; i < this.attributes_array.length; i++) {
        // for (let e=0 ; e < event.length ; e++){
        //   if(event[e].id != this.attributes_array[i].attribute_value.attribute_id)
        //   this.selectedAttributes.push(event[e])
        // }   
        // this.selectedAttributes = event.filter(item  => item.id !== this.attributes_array[i].attribute_value.attribute_id);   
        for (let order of event) {
          if (order.id == this.attributes_array[i].attribute_value.attribute_id) {
            event.splice(event.indexOf(order), 1);
            break;
          }
        }
        this.selectedAttributes = event;
      }
    } else {
      this.selectedAttributes = event;
    }
  }
  change_value_new(item, i) {
    var value_en = (<HTMLInputElement>document.getElementById("value_en_new" + item.id)).value;
    var value_ar = (<HTMLInputElement>document.getElementById("value_ar_new" + item.id)).value;
    if (value_en == '' || value_ar == '') {
      this.toastr.warning(this.translate.instant('msg.enterValues'));
      return;
    }
    if (typeof this.attributes_array_new[i] !== 'undefined') {
      console.info('exists');
      // this.tags_array[i] = tag ;
      this.attribute_item["attribute_id"] = item.id;
      this.attribute_item["value_en"] = value_en;
      this.attribute_item["value_ar"] = value_ar;
      this.attributes_array_new[i] = this.attribute_item
      //  this.attributes_array.push( this.attribute_item );
    } else {
      console.info('does not exist'); // incorrect!
      this.attribute_item["attribute_id"] = item.id;
      this.attribute_item["value_en"] = value_en;
      this.attribute_item["value_ar"] = value_ar;
      this.attributes_array_new.push(this.attribute_item);
    }
    this.attribute_item = {
      "attribute_id": "",
      "value_en": "",
      "value_ar": ""
    };
    console.log(this.attributes_array_new);
    // (<HTMLInputElement>document.getElementById("plus_attr_new" + item.id )).hidden = true ;
    (<HTMLInputElement>document.getElementById("remove_attr_new" + item.id)).hidden = false;
  }
  delete_attr_new(item_del) {
    console.log(item_del)
    for (let k = 0; k < this.attributes_array_new.length; k++) {
      if (this.attributes_array_new[k].attribute_id == item_del.id) {
        this.attributes_array_new = this.attributes_array_new.filter(item => item !== this.attributes_array_new[k])
      }
    }
    this.selectedAttributes = this.selectedAttributes.filter(item => item !== item_del);
    this.selectedAttributesIds = this.selectedAttributesIds.filter(item => item !== item_del.id);
  }
  delete_attr(item_del) {
    this.attributes_array = this.attributes_array.filter(item => item !== item_del);
    this.selectedAttributesIds = this.selectedAttributesIds.filter(item => item !== item_del.id);
  }
  change_value(item) {
    console.log(item)
    var value_en = (<HTMLInputElement>document.getElementById("value_en" + item.id)).value;
    var value_ar = (<HTMLInputElement>document.getElementById("value_ar" + item.id)).value;
    if (value_en == '' || value_ar == '') {
      this.toastr.warning(this.translate.instant('msg.enterValues'));
      return;
    }
    for (let k = 0; k < this.attributes_array.length; k++) {
      if (this.attributes_array[k].id == item.id) {
        this.attributes_array[k].attribute_value.value_en = value_en;
        this.attributes_array[k].attribute_value.value_ar = value_ar;
      }
    }
    console.log(this.attributes_array)
  }
  association_item = {
    "association_id": "",
    "products": []
  }
  asso_Selected(event: any[]) {
    if (this.associations_array.length > 0) {

      for (let i = 0; i < this.associations_array.length; i++) {

        for (let order of event) {
          if (order.id == this.associations_array[i].association_id) {
            event.splice(event.indexOf(order), 1);
            break;
          }
        }
        this.selectedAssociations = event;

      }
    } else {
      this.selectedAssociations = event;
    }

  }
  product_list_new: any[] = []
  select_products_new(event, item, i) {
    this.product_list_new = event;
    console.log(event)
    this.save_asso_new(item, i)

    console.log(event)
  }
  save_asso_new(item, i) {
    console.log(item)
    if (this.product_list_new.length == 0) {
      this.toastr.warning(this.translate.instant('msg.selectProducts'));
      return;
    }
    if (typeof this.associations_array_new[i] !== 'undefined') {
      console.info('exists');
      this.association_item["association_id"] = item.id;
      var ids = []
      for (let k = 0; k < this.product_list_new.length; k++) {
        ids.push(this.product_list_new[k].id);
      }
      this.association_item["products"] = ids;

      this.associations_array_new[i] = this.association_item
      //  this.attributes_array.push( this.attribute_item );
    } else {
      console.info('does not exist'); // incorrect!
      this.association_item["association_id"] = item.id;
      var ids = []
      for (let k = 0; k < this.product_list_new.length; k++) {
        ids.push(this.product_list_new[k].id);
      }
      this.association_item["products"] = ids;
      this.associations_array_new.push(this.association_item);
    }

    // this.association_item[ "association_id" ] = item.id ;
    // var ids= [] 
    // for(let k =0 ; k <  this.product_list_new.length ; k++ ){ 
    //   ids.push(this.product_list_new[k].id);
    // }
    // this.association_item[ "products" ] = ids
    // this.associations_array_new.push( this.association_item );
    this.association_item = {
      "association_id": "",
      "products": []
    }
    this.product_list_new = [];
    // (<HTMLInputElement>document.getElementById("plus_asso_new" + item.id )).hidden = true ;
    (<HTMLInputElement>document.getElementById("remove_asso_new" + item.id)).hidden = false;
    console.log(this.associations_array_new)
  }
  remove_asso_new(item_del) {
    console.log(item_del)
    // console.log(this.selectedAttributes[].id )
    for (let k = 0; k < this.associations_array_new.length; k++) {
      if (this.associations_array_new[k].association_id == item_del.id) {
        this.associations_array_new = this.associations_array_new.filter(item => item !== this.associations_array_new[k])
      }
    }
    this.selectedAssociations = this.selectedAssociations.filter(item => item !== item_del);
    this.selectedAssociationIds = this.selectedAssociationIds.filter(item => item !== item_del.id);

    console.log(this.selectedAssociations)
    console.log(this.associations_array_new)

  }
  save_asso(item) {
    console.log(item)
    if (item.products.length == 0) {
      this.toastr.warning(this.translate.instant('msg.selectProducts'));
      return;
    }
    for (let k = 0; k < this.associations_array.length; k++) {
      if (this.associations_array[k].association_id == item.id) {
        this.associations_array[k].products = item.products
      }
    }
    console.log(this.associations_array)
  }
  remove_asso(item_del) {
    console.log(item_del)
    this.associations_array = this.associations_array.filter(item => item !== item_del);
    this.selectedAssociationIds = this.selectedAssociationIds.filter(item => item !== item_del.association_id);
  }
  // uploads media
  upload_color(files: File[], i) {
    console.log(i)
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
      (<HTMLInputElement>document.getElementById("colorReview" + i)).src = this.previewUrl;
    }
  }
  upload_color_new(files: File[]) {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function () {
      photo_color_new = this.result
    };
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      (<HTMLInputElement>document.getElementById("colorReviewNew")).style.display = "block";
      (<HTMLInputElement>document.getElementById("colorReviewNew")).src = this.previewUrl;
    }
  }
  upload_size_new(files: File[]) {
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function () {
      photo_size_new = this.result
    };
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      (<HTMLInputElement>document.getElementById("sizeReviewNew")).style.display = "block";
      (<HTMLInputElement>document.getElementById("sizeReviewNew")).src = this.previewUrl;
    }
  }
  upload_size(files: File[], i) {
    console.log(i)
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

  public onChangeColor(color: string, item): Cmyk {
    const hsva = this.cpService.stringToHsva(color);
    const rgba = this.cpService.hsvaToRgba(hsva);
    console.log(color)
    return this.cpService.rgbaToCmyk(rgba);
  }
  compareFn(a, b) {
    return (a.id === b.id && !(isNullOrUndefined(a.id) && isNullOrUndefined(b.id)));
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

    this.association_array_formatted = []
    this.attributes_array_formatted = [];

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
    console.log(seller_id)

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

    this.keywords_array_en_all = this.keywords_array_en.concat(this.keywords_array_en_new);
    this.keywords_array_ar_all = this.keywords_array_ar.concat(this.keywords_array_ar_new);
    this.tags_array_all = this.tags_array.concat(this.tags_array_new);
    this.seo_array_all = this.seo_array.concat(this.seo_array_new);

    console.log(this.categories_array)
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
    if (short_description_en == null || short_description_ar == null || description_en == null || description_ar == null) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.warning(this.translate.instant('msg.enterDescription'));
      this.loader_btn = false;
      return;
    }
    this.keywords_array_en_all = this.keywords_array_en_all.filter(item => item !== "");
    console.log(this.keywords_array_en_all)
    if (this.keywords_array_en_all.length == 0) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.keywordsEn'));
      this.loader_btn = false;
      return;
    }
    this.keywords_array_ar_all = this.keywords_array_ar_all.filter(item => item !== "");
    console.log(this.keywords_array_ar_all)
    if (this.keywords_array_ar_all.length == 0) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.keywordsAr'));
      this.loader_btn = false;
      return;
    }
    this.tags_array_all = this.tags_array_all.filter(item => item !== "");
    console.log(this.tags_array_all)
    if (this.tags_array_all.length == 0) {
      (<HTMLInputElement>document.getElementById("tap-detials")).classList.add("myclass");
      this.toastr.info(this.translate.instant('msg.tags'));
      this.loader_btn = false;
      return;
    }
    this.seo_array_all = this.seo_array_all.filter(item => item !== "");
    console.log(this.seo_array_all)
    if (this.seo_array_all.length == 0) {
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
    if (this.inventoryForm.invalid) {
      (<HTMLInputElement>document.getElementById("tap-inventory")).classList.add("myclass");
      // (<HTMLInputElement>document.getElementById("inventory")).style.setProperty("display", "block");;
      this.loader_btn = false;
      return;
    }
  if (price_discount != '' && price_offer == ''){
      if (Number(price) - Number(price_discount) <= 0){
        this.toastr.warning(this.translate.instant('msg.priceDiscount'));
        this.loader_btn = false;
        return;
      }
    }
    if (price_offer != '' && price_discount == '' ){
      if (Number(price) - Number(price_offer) <= 0){
        this.toastr.warning(this.translate.instant('msg.priceOffer'));
        this.loader_btn = false;
        return;
      }
    }
    if (price_discount != '' && price_offer != '' ){
      if (Number(price) - (Number(price_discount) + Number(price_offer) ) <= 0){
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
      "meta_tag_keywords_en": this.keywords_array_en_all,
      "meta_tag_keywords_ar": this.keywords_array_ar_all,
      "tags": this.tags_array_all,
      "seo": this.seo_array_all,
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
      "delivery_estimation" : delivery_estimation ,
      "video": video,
      "image": base_image == null ? this.photo : base_image,
      "images": this.imagesArray,
      "required_points": required_points,
      "categories": this.categories_array,
      "brand_id": brand_id,
      "discount": null,
      "special_offer": null,
      "attributes": [],
      "associations": [],
      "out_of_stock_id": out_of_stock_id,
      "seller_id": seller_id,
      "available_delivery_options": this.selectedOption,
      "available_payment": this.selectedPayment

    }

    console.log(this.associations_array)
    if (this.associations_array.length > 0) {
      for (let k = 0; k < this.associations_array.length; k++) {
        var ids: any[] = [];
        this.association_item["association_id"] = this.associations_array[k].association_id;
        this.associations_array[k].products.forEach(element => {
          ids.push(element.id);

        });
        this.association_item["products"] = ids;
        this.association_array_formatted.push(this.association_item);
        this.association_item = {
          "association_id": "",
          "products": []
        }
      }
    } else {
      this.association_array_formatted = []
    }
    this.association_array_all = this.association_array_formatted.concat(this.associations_array_new);

    newItem.associations = this.association_array_all;
    console.log(this.association_array_all)

    if (this.attributes_array.length > 0) {
      for (let k = 0; k < this.attributes_array.length; k++) {
        this.attribute_item["attribute_id"] = this.attributes_array[k].attribute_value.attribute_id;
        this.attribute_item["value_en"] = this.attributes_array[k].attribute_value.value_en;
        this.attribute_item["value_ar"] = this.attributes_array[k].attribute_value.value_ar;
        this.attributes_array_formatted.push(this.attribute_item);
        this.attribute_item = {
          "attribute_id": "",
          "value_en": "",
          "value_ar": ""
        }
      }
    } else {
      this.attributes_array_formatted = []
    }
    this.attributes_array_all = this.attributes_array_formatted.concat(this.attributes_array_new);

    newItem.attributes = this.attributes_array_all
    console.log(this.attributes_array_all)

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
    this.service.updateProduct(this.productId, newItem).then(
      res => {
        this.loader_btn = false;
        this.toastr.success(this.translate.instant('msg.editProduct'))
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
      'mainlabel': 'Edit Product',
      'links': [
        {
          'name': 'Previous List',
          'isLink': true,
          'link': '/products/list'
        },

      ]
    };
    this.breadcrumbAr = {
      'mainlabel': 'تعديل منتج',
      'links': [
        {
          'name': 'القائمة السابقة',
          'isLink': true,
          'link': '/products/list'
        },

      ]
    };
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
