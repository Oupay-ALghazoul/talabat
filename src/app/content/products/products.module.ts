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
import { EditComponent } from './edit/edit.component'; 
import { ExtraListComponent } from './extraList/list.component'
import { AddExtraComponent } from './addExtra/add.component'
import { EditExtraComponent } from './editExtra/add.component'

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AddComponent } from './add/add.component'
import { UiSwitchModule } from 'ngx-toggle-switch';
import { ColorPickerModule } from 'ngx-color-picker';

import { GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';

import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';

@NgModule({
  declarations: [ ListComponent  , EditComponent , AddComponent , ExtraListComponent ,
    AddExtraComponent , EditExtraComponent ],
  providers: [
    GoogleMapsAPIWrapper,
  ],
  imports: [
     OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    MatIconModule ,
    MatTreeModule ,
    AgmDirectionModule ,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    ColorPickerModule ,
    NgxDatatableModule,
    CommonModule,
    NgbModule,   
    ReactiveFormsModule,FormsModule,
    UiSwitchModule ,
    NgSelectModule ,
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
        path: 'edit/:id',
        component: EditComponent
        
      },
      {
        path: 'add',
        component: AddComponent
      },
      {
        path: 'extraList/:id',
        component: ExtraListComponent  
      },
      {
        path : 'addExtra/:id' ,
        component : AddExtraComponent
      },
      {
        path : 'editExtra/:id' ,
        component : EditExtraComponent
      }
    ])
    ]
})
export class ProductsModule { }
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}