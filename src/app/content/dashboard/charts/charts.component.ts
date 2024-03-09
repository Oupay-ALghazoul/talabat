import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Constant } from 'src/app/constant';
import { Order } from 'src/app/models/Order';
import { User } from 'src/app/models/User';
import { MessagingService } from 'src/app/shared/messaging.service';
import { UserServiceService } from 'src/app/_services/user-service.service';

let noQuotes;

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit {

  @BlockUI('barCharts') blockUIBarCharts: NgBlockUI;
  @BlockUI('lineCharts') blockUILineCharts: NgBlockUI;

  public breadcrumb: any;
  showNew: false;
  arabic : boolean ;
  loader : boolean = true ;

  options = {
    close: false,
    expand: true,
    minimize: false,
    reload: true
  };

  /**
   * barChart
   */
  public barChartOptions: any = {
    responsive: true,
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
            categoryPercentage: 0.8
          }],
          yAxes: [{
            scaleLabel: {
               display: true,
               labelString: []
            }
         }],
          // yAxes: [{
          //   ticks: {
          //       callback: function(value, index, values) {
          //         // console.log(value)
          //           return value + ' KWD';
          //       },
          //       beginAtZero: true
            // }
            data: [
              {
                type: "column",
                dataPoints: [
                  {y : 0}
                // { y: 10, label: "Apples" },
                // { y: 15, label: "Mangos" },
                // { y: 25, label: "Oranges" },
                // { y: 30, label: "Grapes" },
                // { y: 28, label: "Bananas" }
                ]
              }
              ]
      
      
  },
  tooltips: {
    callbacks: {
       label: (tooltipItems, data) => {
     
            return data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index] + ' KWD';
            }
        }
      }
  };

  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartColors : Array<any> = [
    {
      backgroundColor: '#28d094',
      borderColor: '#28d094',
      pointBackgroundColor: '#28d094',
      pointBorderColor: '#28d094',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#28d094',
    }
  ];
  //chart data
  // public barChartData : any [] = [];
  public barChartData: any[] = [
    { data: [], label: 'Sales' },
  ];

  // top numbers
  salesNumber ;
  ordersNumber ;
  customersNumber;
  averageOrderValueNumber = 412.233;
  today:Date = new Date();

  salesChart ;
  salesSummary ;
  users : User [] ;
  orders

  selectedYear: number;
  years: number[] = [];

  empty : boolean = true ;
  permissionList: String[] = JSON.parse(
    localStorage.getItem("permission-talabate")
  );
  showEdit : boolean
  constructor(public translate : TranslateService , public service :Constant , private router: Router ,
    private user: UserServiceService ,  private messagingService: MessagingService ) {
    this.translateMethod() ;
    this.messagingService.requestPermission();

   //  permission update
   if( this.permissionList != null){
    this.permissionList.some((x) => x === "update_user")
      ? (this.showEdit = true)
      : (this.showEdit = false);
    }
     if (
      this.user.getUser() &&
      this.user.getUser().super_admin === true
    ) {
      this.showEdit = true ;
    }
      
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 2018; year--) {
      this.years.push(year);
    }
    this.getData() ;
  }
  getData() {
    this.service.salesChart( this.selectedYear).then((data : any) =>{
      this.salesChart = data;
     
      // this.salesChart.forEach(element => {
      //   // this.barChartOptions.scales.yAxes[0].scaleLabel.labelString.push(element.sum); 
      //   this.barChartOptions.scales.data[0].dataPoints.push(element.sum); 
      // });
      if (data.length != 0){
        this.empty = false ;
        this.salesChart.forEach(element => {
          this.barChartData[0].data.push(element.sum); 
        });      
        this.salesChart.forEach(element => {
          this.barChartLabels.push(element.month);
        });
      }else{
        this.empty = true ;
      }
      console.log( this.barChartOptions)
      
      console.log(data)
    })
     this.service.salesSummary( this.selectedYear).then((data : any) =>{
      this.salesSummary = data;
      this.customersNumber = data.customers ;
      this.ordersNumber = data.paid_orders ;
      this.salesNumber = data.sales ;
      console.log(this.salesSummary)
    })
    this.service.salesNewCustomers().then((data : User []) =>{
      this.users = data;
      console.log(this.users)
    })
    this.service.salesNewOrders().then((data : Order []) =>{
      this.orders = data;
      console.log(this.orders)
      this.loader = false ;
    })
   
  }
  edit(id){
    this.router.navigate(['/users/edit/' + id]);
  }
  showDetails(id){
    this.router.navigate(['/orders/details/' + id]);
  }
  onChange(value){
    this.selectedYear = value ;
    this.barChartData = [
      { data: [], label: 'Sales' },
    ];
    this.barChartLabels = [] ;
    this.loader = true ;
    this.getData()
  }
  /**
   * OnInit
   */
  ngOnInit() {

    this.breadcrumb = {
      'mainlabel': 'Bar Chart',
      // 'links': [
      //   // {
      //   //   'name': 'Home',
      //   //   'isLink': true,
      //   //   'link': '/dashboard/sales'
      //   // },
      //   {
      //     'name': 'BarChart',
      //     'isLink': true,
      //     'link': '#'
      //   },
      // ]
    };
    this.activeTranslation();
    // example way of formating dates
    // this.setChartDates();
    //Setting top bar numbers
    // this.setTopBarNumbers();
  }
    /**
  * Reload card
  */
  reloadBarCharts() {
    this.blockUIBarCharts.start(this.translate.instant('loading' ) ) ;
    // refresh data by api request
    setTimeout(() => {
      // this.setChartDates();
      // this.barChartData  = [
      //   { data: [100, 103, 80, 87, 130, 30, 55], label: this.translate.instant('chart.salesChart') },
      // ];
      this.barChartData = [
        { data: [], label: 'Sales' },
      ];
      this.barChartLabels = [] ;
        this.getData()
      this.blockUIBarCharts.stop();
    }, 2500);
  }
  activeTranslation(){
    this.translate.stream('chart.salesChart').subscribe(value=> this.breadcrumb.mainlabel = value);
    this.translate.stream('home').subscribe(value=> (this.breadcrumb.links && this.breadcrumb.links.length>0) ? (this.breadcrumb.links[0].name = value) : '');
    this.translate.stream('chart.salesChart').subscribe(value=> (this.breadcrumb.links && this.breadcrumb.links.length>0) ? (this.breadcrumb.links[1].name = value) : '');
    this.translate.stream('chart.salesChart').subscribe(value=> (this.barChartData && this.barChartData.length>0)? (this.barChartData[0].label= value) : '');
    
  }
  getParsedDate(today,offsetMonths){
    return formatDate(new Date(today.getFullYear(),today.getMonth()+offsetMonths,today.getDate()), "MM-yyyy", "en");
  }
  setChartDates(){
    this.barChartLabels = [
      this.getParsedDate(this.today,-6),
      this.getParsedDate(this.today,-5),
      this.getParsedDate(this.today,-4), 
      this.getParsedDate(this.today,-3), 
      this.getParsedDate(this.today,-2), 
      this.getParsedDate(this.today,-1), 
      this.getParsedDate(this.today,0)
    ];
  }
  setTopBarNumbers(){
    //replace with api data
    this.salesNumber = 3204.231;
    this.ordersNumber = 120;
    this.customersNumber =234;
    this.averageOrderValueNumber = 412.233;
  }

  translateMethod(){
		this.translate.setDefaultLang('en');
    this.translate.addLangs(['en', 'ar']);    
     
    // localStorage.removeItem("selected");
    // localStorage.removeItem("langId");

    let y = localStorage.getItem("selected");
    console.log(y)

    if(y==null){
      localStorage.setItem("selected", JSON.stringify("en")); 
      this.arabic = false;
      this.translate.use('en');
    }else{
      noQuotes = y.split('"').join('');
      this.translate.use(noQuotes);
      if (noQuotes == 'ar'){
        this.arabic = true;
      }else{
        this.arabic = false;
      }
      document.documentElement.setAttribute('lang','ar')
    }		
    let lang_id = localStorage.getItem("langId");
    console.log(lang_id)
    if(lang_id==null){
      localStorage.setItem("langId", JSON.stringify("2")); 
    }
  }
}