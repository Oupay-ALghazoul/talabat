import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Constant } from 'src/app/constant';
import { About } from 'src/app/models/About';
import { Order } from '../models/Order' ;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class BillingComponent implements OnInit {
  
  public breadcrumb: any;
  public breadcrumbAr :any;

  arabic : boolean ;

  orderId
  order : Order ;
  order_items ;
  loader : boolean = true ;
  formatedDate
  info
  billing_address

  constructor(private translate: TranslateService ,  private route: ActivatedRoute , private service: Constant ) { 
    this.translateMethod();
    this.orderId = this.route.snapshot.params['id'];
    this.service.getOrderDetails(this.orderId ).then( (data : Order)=>{
      this.order = data ;
      console.log(data)
      this.billing_address = data.billing_address ;
      var st =  this.order.date;
      var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
      this.formatedDate = new Date(st.replace(pattern,'$3-$2-$1'));
      this.order_items = data.order_items ;
      this.service.getAbout().then((data: About)=>{
        console.log(data)
        this.info = data;
        this.loader = false ;
      })
    })
  }

  ngOnInit(): void {
     this.breadcrumb = {
      'mainlabel': 'Invoice Details',
    };
    this.breadcrumbAr = {
      'mainlabel': 'تفاصيل الفاتورة',
    };
  }
  translateMethod(){
    // this.translate.setDefaultLang('en');
    // this.translate.addLangs(['en', 'ar']);     
    let lang = localStorage.getItem("selected");
    var langCode = lang.split('"').join('');
    this.translate.use(langCode);
    console.log(langCode)
    let lang_id = localStorage.getItem("langId");
    var langId = lang_id.split('"').join('');
    if (Number(langId) == 1){
      this.arabic = true;

    }else{
      this.arabic = false;
    }
  }
}
