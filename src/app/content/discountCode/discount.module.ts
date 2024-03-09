import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { HistoryComponent } from './history/list.component' ;

// import ngx-translate and the http loader
// import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
// import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';

import {HttpClient, HttpClientModule} from '@angular/common/http';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';

@NgModule({
  declarations: [ HistoryComponent],
  exports: [
    
  ],
  imports: [
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    NgxDatatableModule,
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
    //  TranslateModule.forRoot({
    //      loader: {
    //          provide: TranslateLoader,
    //          useFactory: HttpLoaderFactory,
    //          deps: [HttpClient]
    //      }
    //  }),
    TranslateModule ,
    BreadcrumbModule,
    ArchwizardModule,
    QuillModule.forRoot(),
    PerfectScrollbarModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
    
      {
        path : 'history' ,
        component : HistoryComponent
      }
    
    ])
    ]
})
export class DiscountModule { }
// AoT requires an exported function for factories
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }