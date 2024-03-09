import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { RouterModule } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrderDetailsComponent } from './orderDetails/home.component' ;
import { UserListComponent } from './user-list/list.component'
import { BillingComponent } from './billing/home.component'

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';
import {NgxPrintModule} from 'ngx-print';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [ ListComponent , OrderDetailsComponent , BillingComponent , UserListComponent ],
  providers: [
    GoogleMapsAPIWrapper,
  ],
  exports: [
    
  ],
  imports: [
    NgxBarcodeModule ,
    NgxPrintModule ,
    NgxDatatableModule,
    BsDatepickerModule.forRoot(),
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    UiSwitchModule ,
    CommonModule,
    NgbModule,   
    ReactiveFormsModule,FormsModule,
    BreadcrumbModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
     // ngx-translate and the loader module
     HttpClientModule,
     TranslateModule.forRoot({
         loader: {
             provide: TranslateLoader,
             useFactory: HttpLoaderFactory,
             deps: [HttpClient]
         }
     }),
     AgmDirectionModule,
    BreadcrumbModule,
    ArchwizardModule,
    QuillModule.forRoot(),
    PerfectScrollbarModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
    
      {
        path: 'list',
        component: ListComponent
      },
      {
        path : 'details/:id' ,
        component : OrderDetailsComponent
      },
     {
       path : 'billing/:id' ,
       component : BillingComponent
      } ,
      {
        path : 'user-list/:id' ,
        component : UserListComponent
      }
    ])
    ]
})
export class OrdersModule { }
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}