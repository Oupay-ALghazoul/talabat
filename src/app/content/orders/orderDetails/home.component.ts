import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Constant } from 'src/app/constant';
import { Order } from '../models/Order';
import { User } from '../../../models/User';
import { environment } from 'src/environments/environment';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable'
import { UserServiceService } from 'src/app/_services/user-service.service';
import { Warehouse } from 'src/app/models/Warehouse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

let langId;
let langCode;
require('jspdf-autotable');
declare let pdfMake: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderId = '';
  arabic: boolean;
  order: Order;
  loader: boolean = true;
  order_items
  user
  formatedDate
  seller
  register_date
  billing_address
  payment

  deliveryId = '';
  warehouseId = '';
  Warehouses : Warehouse [] ;
  cancel_loader: boolean = false;
  pay_loader: boolean = false;
  approve_loader: boolean = false;
  delivered_loader: boolean = false;
  loader_assign: boolean = false
  loader_ongoing: boolean = false;
  refund_loader : boolean = false;

  addForm: FormGroup;
  submitted = false;

  deliveries: User[];
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit: boolean = false;
  constructor(private service: Constant, private router: Router, private toastr: ToastrService , private formBuilder: FormBuilder
    , private translate: TranslateService, private route: ActivatedRoute, private user2: UserServiceService) {
    this.orderId = this.route.snapshot.params['id'];
    this.translateMethod();
    this.getOrderDetails();
    //  permission update
    if (this.permissionList != null) {
      this.permissionList.some((x) => x === "update_order")
        ? (this.showEdit = true)
        : (this.showEdit = false);
    }
    if (
      this.user2.getUser() &&
      this.user2.getUser().super_admin === true
    ) {
      this.showEdit = true;
    }
    this.service.getActiveDelivery().then((data: User[]) => {
      console.log(data)
      this.deliveries = data;
    })
    this.service.getWarehouseMenu().then((data: Warehouse[]) => {
      console.log(data)
      this.Warehouses = data;
    })
  
  }
  address
  getOrderDetails() {
    this.service.getOrderDetails(this.orderId).then((data: Order) => {
      this.order = data;
      console.log(data)
      this.order_items = data.order_items;
      this.address = data.address ;
      var st = this.order.date;
      var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
      this.formatedDate = new Date(st.replace(pattern, '$3-$2-$1'));
      this.seller = this.order.seller;
      this.user = data.user;
      console.log(this.order);
      this.register_date = this.order.user.created_at.substring(0, 10)
      console.log(this.register_date)
      var today = new Date().toISOString().slice(0, 10)
      console.log(today)

      const date1 = new Date(this.register_date);
      const date2 = new Date(today);
      console.log(this.getDifferenceInDays(date1, date2));

      this.billing_address = this.order.billing_address;
      this.payment = this.order.payment;
      this.addForm = this.formBuilder.group({
        user_id: [ this.order.delivery != null ? this.order.delivery.id : '',Validators.required ],
        warehouse_id: [ this.order.warehouse != null ? this.order.warehouse.id : '' ,Validators.required ], 
      });
      this.loader = false
    })

  }
  getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }
  showBilling() {
    this.router.navigate(['/orders/billing/' + this.orderId]);
  }

  approve() {
    this.approve_loader = true;
    this.service.approveOrder(this.orderId, '').then((data: Order) => {
      console.log(data)
      this.approve_loader = false;
      this.toastr.success(this.translate.instant('msg.approveOrder'))
      this.getOrderDetails()
    }, err => {
      this.approve_loader = false;
      this.toastr.error(err)
    })
  }
  delivered() {
    this.delivered_loader = true;
    this.service.deliveredOrder(this.orderId, '').then((data: Order) => {
      console.log(data)
      this.delivered_loader = false;
      this.toastr.success(this.translate.instant('msg.deliveredOrder'))
      this.getOrderDetails()
    }, err => {
      this.delivered_loader = false;
      this.toastr.error(err)
    })
  }
  cancelOrder() {
    this.cancel_loader = true;

    this.service.cancelOrder(this.orderId, '').then((data: Order) => {
      console.log(data)
      this.cancel_loader = false;
      this.toastr.success(this.translate.instant('msg.cancelOrder'))
      this.getOrderDetails()
    }, err => {
      this.cancel_loader = false;
      this.toastr.error(err)
    })
  }
  on_going(){
    this.loader_ongoing = true;

    this.service.ongoingOrder(this.orderId, '').then((data: Order) => {
      console.log(data)
      this.loader_ongoing = false;
      this.toastr.success(this.translate.instant('msg.ongoingOrder'))
      this.getOrderDetails()
    }, err => {
      this.loader_ongoing = false;
      this.toastr.error(err)
    })
  }
  chooseDeliveryMan(value: string) {
    this.deliveryId = value
  }
  chooseWarehouse(value: string) {
    this.warehouseId = value
  }
  get f() {
    return this.addForm.controls;
  }
  assign() {
    this.loader_assign = true;

    var user_id =  this.f.user_id.value; 
    var warehouse_id = this.f.warehouse_id.value;

    const newItem = {
      "order_id": "",
      "user_id": "" ,
      "warehouse_id" : ""
    }
    newItem.order_id = this.orderId;
    newItem.user_id = user_id ;
    newItem.warehouse_id = warehouse_id ;

    this.submitted = true;
    if (this.addForm.invalid) {
      this.loader_assign = false;
      return;
    }
    console.log(newItem)
    // if( this.deliveryId != '' && this.warehouseId != ''){
      this.service.assignOrderToDelivery(newItem).then((data : Order) => {
        console.log(data)
        this.loader_assign = false ;
        this.addForm = this.formBuilder.group({
          user_id: [data.delivery.id,Validators.required ],
          warehouse_id: [data.warehouse.id,Validators.required ], 
        });
        if (langCode == 'ar') {
          this.toastr.success("تم اسناد الطلب لموصل بنجاح");
        } else {
          this.toastr.success("Order Assigned To Delivery Successfuly");
        }
        this.getOrderDetails();
      }, (err => {
        this.loader_assign = false
        this.toastr.error(err)
      }))
    // }else{
    //   if (langCode == 'ar') {
    //     this.toastr.warning(" اختر موصل ومخزن");
    //   } else {
    //     this.toastr.warning("Select Delivery Man & Warehouse");
    //   }
    //     this.loader_assign = false
    // }

  }
  payOrder() {
    this.pay_loader = true;

    this.service.payOrder(this.orderId, '').then((data: Order) => {
      console.log(data)
      this.pay_loader = false;
      this.toastr.success(this.translate.instant('msg.payOrder'))
      this.getOrderDetails()
    }, err => {
      this.pay_loader = false;
      this.toastr.error(err)
    })
  }
  RefundOrder() {
    this.refund_loader = true;

    this.service.refundOrder(this.orderId, '').then((data: Order) => {
      console.log(data)
      this.refund_loader = false;
      this.toastr.success(this.translate.instant('msg.refundOrder'))
      this.getOrderDetails()
    }, err => {
      this.refund_loader = false;
      this.toastr.error(err)
    })
  }
  ngOnInit(): void {
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
  exportRecipt() {
    const imageFromNgxBarcode = document.getElementsByClassName("barcode")[0].childNodes[0];
    console.debug(imageFromNgxBarcode);

    const barcode = (imageFromNgxBarcode as any).currentSrc as string;
    const doc = new jsPDF({ format: [80, 160] });
    const col = [this.translate.instant('orderDetails.productName'), this.translate.instant('orderDetails.quantity'), this.translate.instant('orderDetails.price'), this.translate.instant('orderDetails.total')];
    const col_ar = [this.translate.instant('orderDetails.total'), this.translate.instant('orderDetails.price'), this.translate.instant('orderDetails.quantity'), this.translate.instant('orderDetails.productName')];
    const rows = [];
    const foot = [{ a: '       ' }]
    let lastTableY = 50;
    if (langCode == 'en')
      this.order.order_items.forEach((element: any) => {
        const temp = [
          element.unit_name_en,
          element.quantity,
          element.unit_price,
          element.total
        ];
        rows.push(temp);
        // element.options.forEach(option=> {
        //   const opt =[
        //   (option.title? option.title : '' )+'('+option.price+')'
        //   ];
        //   rows.push(opt);

        // });
        if (element.unit_size != null) {
          const size = [
            element.unit_size.name
          ];
          rows.push([this.translate.instant('order.size') + '  :', size]);
        }
        if (element.unit_color != null) {
          const color = [
            element.unit_color.name_en
          ];
          rows.push([this.translate.instant('order.color') + '  :', color]);
        }

      });
    else
      this.order.order_items.forEach((element: any) => {
        const temp = [
          element.total,
          element.unit_price,
          element.quantity,
          element.unit_name_ar
        ];

        rows.push(temp);
        // element.options.forEach(option=> {
        //   const opt =[' ', ' ', ' ' ,
        //   (option.title_ar?option.title_ar:'') +'('+option.price+')'
        //   ];
        //   rows.push(opt);
        // });
        if (element.unit_size != null) {
          const size = [
            element.unit_size.name
          ];
          rows.push([size + '  :', this.translate.instant('order.size')]);
        }
        if (element.unit_color != null) {
          const color = [
            element.unit_color.name_ar
          ];
          rows.push([color + '  :', this.translate.instant('order.color')]);
        }
      });

    const font = environment.font.trim();
    doc.addFileToVFS('Amiri.ttf', font);
    doc.addFont('Amiri.ttf', 'Amiri', 'normal');
    doc.setFont("Amiri"); // set font
    //128 x 128 the logo image pixels
    const width = Number.parseInt((128 * 0.264583 * 0.5).toFixed(0));
    const height = Number.parseInt((128 * 0.264583 * 0.5).toFixed(0));
    //default a4 page in milimeter 210 x 297 changed to 80 x 160 recipet
    const toCenterOffset = (80 - width) / 2;
    doc.addImage("/assets/images/logo-dark.png", 'PNG', toCenterOffset, 2, width, height)

    let useropt: any = {} as any;
    useropt.foot = foot;
    const rows1 = [];
    rows1.push([this.translate.instant('orderDetails.orderDate') + '  :', this.order.date]);
    rows1.push([this.translate.instant('orderDetails.id') + '  :', this.order.number]);
    // rows1.push([this.translate.instant('addResutrant.tax_number')+'  :' , this.order.restaurant.tax_number]);
    rows1.push([this.translate.instant('orderDetails.delivery_method') + '  :',
    (this.order.delivery_method == 'Pick Up') ? this.translate.instant('orderDetails.pickUp') : this.translate.instant('orderDetails.appDelivery')]);
    rows1.push([this.translate.instant('orderDetails.notes') + '  :', this.order.notes]);

    const rows1_ar = [];
    rows1_ar.push([this.order.date + '  :', this.translate.instant('orderDetails.orderDate')]);
    rows1_ar.push([this.order.number + '  :', this.translate.instant('orderDetails.id')]);
    // rows1_ar.push([ this.order.  + '  :'  , this.translate.instant('addResutrant.tax_number') ]);
    rows1_ar.push([this.order.delivery_method == 'Pick Up' ? this.translate.instant('orderDetails.pickUp') : this.translate.instant('orderDetails.appDelivery') +
      '  :', this.translate.instant('orderDetails.delivery_method')]);
    rows1_ar.push([this.order.notes + '  :', this.translate.instant('orderDetails.notes')]);

    useropt.body = (langCode == 'en') ? rows1 : rows1_ar

    useropt.styles = { font: 'Amiri', minCellWidth: 10, fontStyle: 'Amiri', halign: (langCode == 'en') ? 'left' : 'right' };
    useropt.headStyles = { font: 'Amiri', minCellWidth: 15, fontStyle: 'Amiri', halign: (langCode == 'en') ? 'left' : 'right' };
    useropt.bodyStyles = { font: 'Amiri', minCellWidth: 10, fontStyle: 'Amiri', halign: (langCode == 'en') ? 'left' : 'right' };
    useropt.footStyles = { halign: 'center' }
    useropt.theme = 'plain';
    useropt.startY = 25;
    useropt.tableWidth = "auto";
    useropt.margin = { right: 0, left: 0 };
    useropt.didDrawCell = (data) => {
      if (data.section === 'foot' && data.column.index === 0) {
        lastTableY = data.cell.y;
      }
    }
    autoTable(doc, useropt);
    doc.setLineWidth(0.6);
    doc.setDrawColor(0);
    doc.line(5, lastTableY + 3, 75, lastTableY + 3);
    useropt.startY = lastTableY + 4;
    useropt.columns = (langCode == 'en') ? col : col_ar;
    useropt.body = rows;
    useropt.didDrawCell = (data) => {
      if (data.section === 'foot' && data.column.index === 0) {
        lastTableY = data.cell.y;
      }
    }
    autoTable(doc, useropt);
    // doc.setLineDashPattern([7, 3, 1, 3], 10);
    doc.setLineWidth(0.6);
    doc.setDrawColor(0);
    doc.line(5, lastTableY + 3, 75, lastTableY + 3);
    useropt.startY = lastTableY + 6;
    const rows2 = [];
    rows2.push([this.translate.instant('order.tax_total') + '  :', this.order.tax]);
    rows2.push([this.translate.instant('order.shipping_total') + '  :', this.order.shipping_total]);
    // rows2.push([this.translate.instant('orderDetails.sub_total_before_tax')+':' , this.order.sub_total_before_tax ]);
    rows2.push([this.translate.instant('order.promotion_total') + '  :', this.order.coupon_total]);
    rows2.push([this.translate.instant('order.delivery_total') + '  :', this.order.delivery_total]);
    rows2.push([this.translate.instant('order.order_total') + '  :', this.order.total]);

    const rows2_ar = [];

    rows2_ar.push([this.order.tax + '  :', this.translate.instant('order.tax_total')]);
    rows2_ar.push([this.order.shipping_total + '  :', this.translate.instant('order.shipping_total')]);
    rows2_ar.push([this.order.coupon_total + '  :', this.translate.instant('order.promotion_total')]);
    rows2_ar.push([this.order.delivery_total + '  :', this.translate.instant('order.delivery_total')]);
    rows2_ar.push([this.order.total + '  :', this.translate.instant('order.order_total')]);

    useropt.body = (langCode == 'en') ? rows2 : rows2_ar;
    useropt.headStyles = { font: 'Amiri', minCellWidth: 35, fontStyle: 'Amiri', halign: (langCode == 'en') ? 'left' : 'right' };

    useropt.head = [{ a: '       ' }];
    useropt.showFoot = "lastPage";
    useropt.didDrawCell = (data) => {
      if (data.section === 'foot' && data.column.index === 0) {
        var base64Img = barcode;
        // units are in milimeter , pixel to mili is * 0.264583
        const width = Number.parseInt(((imageFromNgxBarcode as any).width * 0.264583 * 0.5).toFixed(0));
        const height = Number.parseInt(((imageFromNgxBarcode as any).height * 0.264583 * 0.5).toFixed(0));
        //default a4 page in milimeter 210 x 297 changed to 80 x 160 recipet
        const toCenterOffset = (80 - width) / 2;
        doc.addImage(base64Img, 'PNG', toCenterOffset, data.cell.y + 2, width, height)
        lastTableY = data.cell.y + height;
      }
    }
    autoTable(doc, useropt);


    doc.save(this.translate.instant('orderDetails.order_details') + '.pdf');

  }
}
