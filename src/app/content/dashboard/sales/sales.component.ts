import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { TableApiService } from 'src/app/_services/table-api.service';
import { TableexcelService } from '../../../_services/tableexcel.service';
import { TranslateService } from '@ngx-translate/core';
const jsPDF = require('jspdf');
require('jspdf-autotable');

//lang variables
let langCode;
let langId;

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  data: any;
  row: any;
  ngOnInit() {
    this.tableApiservice.getTableButtonData().subscribe(Response => {
      this.data = Response;
      this.getTabledata();
      });
  }
  getTabledata() {
    this.row = this.data.rows;
  }
  getExcelData(): void {
    this.tableexcelService.exportAsExcelFile(this.row, 'Modern Admin - Clean Angular8+ Dashboard HTML Template');
  }
  getPdfData() {

    const doc = new jsPDF();
    const col = ['Name', 'Position', 'office', 'age', 'salary', 'startdate'];
    const rows = [];

    this.row.forEach(element => {
      const temp = [element.name, element.position, element.office, element.age, element.salary, element.startdate
      ];
      rows.push(temp);

    });
    doc.autoTable(col, rows);
    doc.save('Test.pdf');
  }

  timeSheet: FormGroup;
  issueTracking: FormGroup;
  

  constructor(private route: Router,private formBuilder: FormBuilder ,   
       private translate: TranslateService ,
       private tableApiservice: TableApiService , private tableexcelService : TableexcelService
    ) { 
      this.timeSheet = this.formBuilder.group({
        employeeName: ['', Validators.required],
      });
      this.issueTracking = this.formBuilder.group({
        dateOpened: ['', Validators.required],
        dateFixed: ['', Validators.required],      
      });
      this.translateMethod()
    }

    arabic : boolean;

    translateMethod(){
      this.translate.setDefaultLang('en');
      this.translate.addLangs(['en', 'ar']);     
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
  }