import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig
} from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  NgbModule,
  NgbCarouselConfig,
  NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
// import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AuthGuard } from './_guards/auth.guard';
import { AlertComponent } from './_helpers/alert.component';
import { AlertService } from './_services/alert.service';
import { AuthService } from './_services/auth.service';
import { ChartApiService } from './_services/chart.api';
import { TableApiService } from './_services/table-api.service';
import { ApplicationApiService } from './_services/application-api.service';
import { QuillInitializeServiceService } from './_services/quill-initialize-service.service';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';

// Routing
import { routing } from './app.routing';
// Components
import { AppComponent } from './app.component';
import { SettingsModule } from './_layout/settings/settings.module';
import { ThemeSettingsConfig } from './_layout/settings/theme-settings.config';
import { MenuSettingsConfig } from './_layout/settings/menu-settings.config';
import { HeaderComponent } from './_layout/header/header.component';
import { VerticalComponent as HeaderVerticalComponent } from './_layout/header/vertical/vertical.component';
import { HorizontalComponent as HeaderHorizontalComponent } from './_layout/header/horizontal/horizontal.component';
import { FullLayoutNavbarComponent } from './_layout/header/full-layout-navbar/full-layout-navbar.component';
import { FooterComponent } from './_layout/footer/footer.component';
import { NavigationComponent as AppNavigationComponent } from './_layout/navigation/navigation.component';
import { PublicLayoutComponent } from './_layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './_layout/private-layout/private-layout.component';
import { RegisterComponent } from './register';
import { SocialSigninComponent } from './social-signin/social-signin.component';
import { LoginComponent } from './login';
import { ChangelogComponent } from './changelog/changelog.component';
import { NavbarService } from './_services/navbar.service';
import { VerticalnavComponent } from './_layout/navigation/verticalnav/verticalnav.component';
import { HorizontalnavComponent } from './_layout/navigation/horizontalnav/horizontalnav.component';
// perfect scroll bar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// spinner
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { RouterModule } from '@angular/router';
import { CustomizerComponent } from './_layout/customizer/customizer.component';
import { ChartsModule } from 'ng2-charts';
import { BreadcrumbModule } from './_layout/breadcrumb/breadcrumb.module';
import { HorizontalCustomizerComponent } from './_layout/customizer/horizontal-customizer/horizontal-customizer.component';
import { BlockTemplateComponent } from './_layout/blockui/block-template.component';
import { BlockUIModule } from 'ng-block-ui';
import { FullLayoutComponent } from './_layout/full-layout/full-layout.component';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from './_api/user/user.service';
import { PrivacyPolicyComponent } from './login/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './login/terms-condition/terms-condition.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import {NgxPrintModule} from 'ngx-print';

import { CountriesModule } from './content/countries/countries.module'
import { FAQModule } from './content/FAQ/FAQ.module'
import { UsersModule } from './content/users/users.module'
import { NotificationModule } from './content/notification/notification.module'
import { SettingModule } from './content/setting/setting.module'
import { DeliveryModule } from './content/delivery/delivery.module'
import { OrdersModule } from './content/orders/orders.module'
import { DiscountModule } from './content/discountCode/discount.module'

import { httpInterceptorProviders } from './http-interceptors';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RolesModule } from './content/roles/roles.module'
import { ManagerModule} from './content/manager/manager.module'
import {MatIconModule} from '@angular/material/icon';
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';

// new 
import {BrandsModule } from './content/brands/brands.module'
import { CategoryModule } from './content/categories/category.module'
import {ProductsModule} from './content/products/products.module'
import { OutOfStockModule } from './content/outOfStock/outOfStock.module'
import { DeliveryOptionsModule } from './content/deliveryOptions/deliveryOptions.module'
import  { AttributesModule } from './content/attributes/attributes.module'
import { AssociationModule } from './content/association/association.module'
import { PaymentModule } from './content/payment/payment.module'
import { ReviewsModule } from './content/reviews/reviews.module'
import { BarRatingModule } from 'ngx-bar-rating';
import { SellersModule } from './content/sellers/seller.module'
import { WarehouseModule } from './content/warehouse/warehouse.module'
import { MessagingService } from './shared/messaging.service';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
// import { AngularFireDatabaseModule } from '@angular/fire/database';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';;
import { CountDownComponent } from './_layout/count-down/count-down.component'

@NgModule({
    imports: [
      BarRatingModule ,
      Ng2TelInputModule ,
      NgxIntlTelInputModule ,
      CdkTableModule,
      CdkTreeModule,
      MatIconModule,
      NgxBarcodeModule ,
        BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        ReactiveFormsModule,
        HttpClientModule,
        ChartsModule,
        BrowserAnimationsModule,
        BreadcrumbModule,
        NgbModule,
        FormsModule,
        // AngularFireDatabaseModule,
        AngularFireMessagingModule,
        AngularFireModule.initializeApp(environment.firebase),
        // AngularFirestoreModule, // imports firebase/firestore, only needed for database features
        AngularFireAuthModule, // imports firebase/auth, only needed for auth features
         routing,
        // Settings modules
        SettingsModule.forRoot(ThemeSettingsConfig, MenuSettingsConfig),
        PerfectScrollbarModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule,
        DeviceDetectorModule.forRoot(),
        LoadingBarRouterModule,
        BlockUIModule.forRoot({
          template: BlockTemplateComponent
        }),
        CategoryModule ,
        CountriesModule ,
        FAQModule ,
        UsersModule ,
        NotificationModule ,
        SettingModule ,
        DeliveryModule  ,
        OrdersModule ,
        RolesModule ,
        ManagerModule ,

        BrandsModule ,
        ProductsModule ,
        OutOfStockModule ,
        DeliveryOptionsModule ,
        AttributesModule ,
        AssociationModule ,
        PaymentModule ,
        ReviewsModule ,
        SellersModule ,
        WarehouseModule ,
        DiscountModule ,
        NgxPrintModule
        // ExportAsModule
    ],
    declarations: [
        AppComponent,
        PublicLayoutComponent,
        PrivateLayoutComponent,
        HeaderComponent,
        FullLayoutNavbarComponent,
        HeaderHorizontalComponent,
        HeaderVerticalComponent,
        FooterComponent,
        AppNavigationComponent,
        AlertComponent,
        RegisterComponent,
        SocialSigninComponent,
        LoginComponent,
        ChangelogComponent,
        VerticalnavComponent ,
        HorizontalnavComponent ,
        CustomizerComponent,
        HorizontalCustomizerComponent,
        BlockTemplateComponent,
        FullLayoutComponent,
        PrivacyPolicyComponent,
        TermsConditionComponent,
        CountDownComponent

      ],
    providers: [
     
        AuthGuard,
        ChartApiService,
        AlertService,
        NavbarService,
        TableApiService,
        ApplicationApiService,
        QuillInitializeServiceService,
        AuthService,
        UserService,
        MessagingService, 
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerGestureConfig
        },
        NgbCarouselConfig,
        NgbModalConfig,
        httpInterceptorProviders ,
        {provide: LocationStrategy, useClass: HashLocationStrategy} ,
        { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },

    ],
    bootstrap: [AppComponent],
    exports: [RouterModule]
})
export class AppModule {}
export function getLocalStorage() {
  return (typeof window !== "undefined") ? window.localStorage : null;
}
