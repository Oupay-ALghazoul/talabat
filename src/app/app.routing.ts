import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './_layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './_layout/private-layout/private-layout.component';
import { AuthGuard } from './_guards/auth.guard';
import { RegisterComponent } from './register';
import { LoginComponent } from './login';
import { ChangelogComponent } from './changelog/changelog.component';
import { FullLayoutComponent } from './_layout/full-layout/full-layout.component';
import { PrivacyPolicyComponent } from './login/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './login/terms-condition/terms-condition.component';

const appRoutes: Routes = [
  { path: 'privacypolicy', component: PrivacyPolicyComponent },
  { path: 'termCondition', component: TermsConditionComponent },
  // Public layout
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: '', component: LoginComponent }
    ]
  },
 
  // Private layout
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      { path: 'logout', component: LoginComponent, canActivate: [AuthGuard] },
      { path: 'changelog', component: ChangelogComponent, canActivate: [AuthGuard] },
      { path: 'dashboard', loadChildren: () => import('../app/content/dashboard/dashboard.module').then(m => m.DashboardModule)
      , canActivate: [AuthGuard] },
     
      { path: 'icons', loadChildren: () => import('../app/content/icons/icons.module').then(m => m.IconsModule), canActivate: [AuthGuard] },
    
      { path: 'categories', loadChildren: '../app/content/categories/category.module#CategoryModule', canActivate: [AuthGuard] },       
       { path: 'countries', loadChildren: '../app/content/countries/countries.module#CountriesModule', canActivate: [AuthGuard] },
      { path: 'FAQs', loadChildren: '../app/content/FAQ/FAQ.module#FAQModule', canActivate: [AuthGuard] },
       { path: 'users', loadChildren: '../app/content/users/users.module#UsersModule', canActivate: [AuthGuard] },
       { path: 'products', loadChildren: '../app/content/products/products.module#ProductsModule', canActivate: [AuthGuard] } ,
        
        { path: 'discount', loadChildren: '../app/content/discountCode/discount.module#DiscountModule', canActivate: [AuthGuard] },

       { path: 'notification', loadChildren: '../app/content/notification/notification.module#NotificationModule', canActivate: [AuthGuard] } ,
       { path: 'setting', loadChildren: '../app/content/setting/setting.module#SettingModule', canActivate: [AuthGuard] } ,
       { path: 'delivery', loadChildren: '../app/content/delivery/delivery.module#DeliveryModule', canActivate: [AuthGuard] } ,
       { path: 'orders', loadChildren: '../app/content/orders/orders.module#OrdersModule', canActivate: [AuthGuard] } ,
       { path: 'roles', loadChildren: '../app/content/roles/roles.module#RolesModule', canActivate: [AuthGuard] } ,
       { path: 'manager', loadChildren: '../app/content/manager/manager.module#ManagerModule', canActivate: [AuthGuard] } ,
       
       { path: 'brands', loadChildren: '../app/content/brands/brands.module#BrandsModule', canActivate: [AuthGuard] } ,
       
       { path: 'outOfStock', loadChildren: '../app/content/outOfStock/outOfStock.module#OutOfStockModule', canActivate: [AuthGuard] } ,
       
       { path: 'deliveryOptions', loadChildren: '../app/content/deliveryOptions/deliveryOptions.module#DeliveryOptionsModule', canActivate: [AuthGuard] } ,
       
       { path: 'attributes', loadChildren: '../app/content/attributes/attributes.module#AttributesModule', canActivate: [AuthGuard] } ,

        { path: 'association', loadChildren: '../app/content/association/association.module#AssociationModule', canActivate: [AuthGuard] } ,

        { path: 'payment', loadChildren: '../app/content/payment/payment.module#PaymentModule', canActivate: [AuthGuard] } ,

        { path: 'reviews', loadChildren: '../app/content/reviews/reviews.module#ReviewsModule', canActivate: [AuthGuard] } ,
    
        { path: 'sellers', loadChildren: '../app/content/sellers/seller.module#SellersModule', canActivate: [AuthGuard] } ,
        { path: 'warehouse', loadChildren: '../app/content/warehouse/warehouse.module#WarehouseModule', canActivate: [AuthGuard] } ,

        
      ],
  },
  // otherwise redirect to home
  { path: '**', redirectTo: 'changelog' }
];

export const routing = RouterModule.forRoot(appRoutes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top' });
