import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { ChartistModule } from 'ng-chartist';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { SalesComponent } from './sales/sales.component';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from '../../_layout/blockui/block-template.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { ChartsComponent } from './charts/charts.component'

@NgModule({
  imports: [
    CommonModule,
    BreadcrumbModule ,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    ChartistModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxDatatableModule,
    PerfectScrollbarModule,
    NgbModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: 'ecommerce',
        component: EcommerceComponent
      },
      {
        path: 'sales',
        component: SalesComponent
      },
      {
        path: 'charts',
        component: ChartsComponent
      }
    ])
  ],
  declarations: [EcommerceComponent, SalesComponent , ChartsComponent
   ],

  exports: [RouterModule]
})
export class DashboardModule { }
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}