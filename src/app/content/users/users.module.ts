import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
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
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { EditAdminPassComponent } from './edit-admin-pass/profile-edit.component';
import { UserInfoComponent } from './userInfo/profile.component'
import { EditComponent } from './edit/add.component'
import { NgSelectModule } from '@ng-select/ng-select';
import {Ng2TelInputModule} from 'ng2-tel-input';

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { SafePipe } from '../../models/safe'
import {MatIconModule} from '@angular/material/icon';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [ ListComponent , AddComponent  , ProfileEditComponent , EditComponent
  , EditAdminPassComponent , UserInfoComponent , SafePipe],
  exports: [
    SafePipe
  ],
  imports: [
    NgxIntlTelInputModule ,
    NgSelectModule ,
    Ng2TelInputModule ,
    MatIconModule,
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
        path: 'add',
        component: AddComponent
      },
      {
        path: 'list',
        component: ListComponent
      },
      {
        path : "userInfo/:id" ,
        component: UserInfoComponent
      },
      {
        path : "editProfile",
        component : ProfileEditComponent
      },
      {
        path : "editPassword" ,
        component : EditAdminPassComponent
      },
      {
        path : "edit/:id" ,
        component : EditComponent
      }
    ])
    ]
})
export class UsersModule { }
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}