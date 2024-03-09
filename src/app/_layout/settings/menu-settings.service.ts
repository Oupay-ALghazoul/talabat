import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as _ from 'lodash';
import { UserServiceService } from 'src/app/_services/user-service.service';

export const MENU_SETTINGS_CONFIG = new InjectionToken('menuCustomConfig');

@Injectable({
  providedIn: 'root'
})
export class MenuSettingsService {

  private _configSubject: BehaviorSubject<any>;
  private readonly _defaultConfig: any;

  constructor(private _router: Router, @Inject(MENU_SETTINGS_CONFIG) private _config, private user: UserServiceService
  ) {
    let y = localStorage.getItem("selected");
    if (y == null) {
      localStorage.setItem("selected", JSON.stringify("ar"));
    }
    let lang = localStorage.getItem("selected").split('"').join('');
    // Set the default config from the user provided config (from forRoot)
    this._defaultConfig =
      this.user.getUser() && this.user.getUser().super_admin === true
        ? {
          horizontal_menu: {
            items: [],

          },
          vertical_menu:
          {
            items: [
              {
                title: lang == "ar" ? 'لوحة التحكم' : 'Dashboard',
                icon: 'la-home',
                page: '/dashboard/charts',

              },
              {
                title: lang == "ar" ? 'ادارة المنتجات' : 'Products Management',
                icon: 'la-tag',
                page: '/products/list',

              },
              {
                title: lang == "ar" ? 'ادارة العملاء' : 'Customers Management',
                icon: 'la-users',
                page: '/users/list',

              },
              {
                title: lang == "ar" ? 'ادارة الإشعارات' : 'Notification Management',
                icon: 'la-bell-o',
                page: '/notification/allNotification',

              },
              {
                title: lang == "ar" ? 'الماركات' : 'Brands',
                icon: 'la-certificate',
                page: '/brands/list'
              },

              {
                title: lang == "ar" ? 'حالة نفاذ الكمية' : 'Out Of Stock',
                icon: 'la-list-alt',
                page: '/outOfStock/list'
              },
              {
                title: lang == "ar" ? 'خيارات التوصيل المتاحة' : 'Delivery Options',
                icon: 'la-list-alt',
                page: '/deliveryOptions/list'
              },
              {
                title: lang == "ar" ? 'خصائص المنتج' : 'Product Attributes',
                icon: 'la-list-alt',
                page: '/attributes/list'
              },
              {
                title: lang == "ar" ? 'ارتباطات المنتج' : 'Product Association',
                icon: 'la-chain',
                page: '/association/list'
              },

              {
                title: lang == "ar" ? 'خيارات الدفع' : 'Payment Options',
                icon: 'la-list-alt',
                page: '/payment/list'
              },
              {
                title: lang == "ar" ? 'تقييمات المنتجات' : 'Products Reviews',
                icon: 'la-list-alt',
                page: '/reviews/list'

              },
              {
                title: lang == "ar" ? 'طلبات الشراء' : 'Purchase Orders',
                icon: 'la-cart-arrow-down',
                page: '/orders/list'
              },
              {
                title: lang == "ar" ? 'أكواد الحسم' : 'Discount Codes',
                icon: 'la-money',
                page: '/discount/history'
              },

              {
                title: lang == "ar" ? 'ادارة الموصلين' : 'Delivery Management',
                icon: 'la-bicycle',
                page: '/delivery/list',
              },

              {
                title: lang == "ar" ? 'تصنيفات المنتجات' : 'Product Categories',
                icon: 'la-table',
                page: '/categories/list'

              },
              {
                title: lang == "ar" ? 'ادارة الدول' : 'Countries Manangement',
                icon: 'la-flag',
                page: '/countries/list'

              },

              {
                title: lang == "ar" ? 'ادارة الأدوار' : 'Roles Management',
                icon: 'la la-cogs',
                page: '/roles/list',

              },
              {
                title: lang == "ar" ? 'ادارة المستخدمين' : 'Users Management',
                icon: 'la la-cogs',
                page: '/manager/list'

              },
              {
                title: lang == "ar" ? 'ادارة البائعين' : 'Sellers Management',
                icon: 'la la-users',
                page: '/sellers/list'

              },

              {
                title: lang == "ar" ? 'ادارة المخازن' : 'Warehouse Management',
                icon: 'la la-industry',
                page: '/warehouse/list'

              },
              {
                title: lang == "ar" ? 'ادارة الأسئلة الشائعة' : 'FAQ Management',
                icon: 'la-question',
                page: '/FAQs/list'
              },
              {
                title: lang == "ar" ? 'اعدادات المنصة' : 'Platform Settings',
                icon: 'la-gear',
                page: '/setting/platfrom',

              },
              {
                title: lang == "ar" ? 'الإعدادات' : 'Setting',
                icon: 'la-gear',
                page: '/setting/info',

              },
              {
                title: lang == "ar" ? 'تواصل معنا' : 'Contact Us',
                icon: 'la-phone',
                page: '/setting/contactUs',

              }

            ]
          }

        } :

        {
          horizontal_menu: {
            items: [],

          },
          vertical_menu:
          {
            items: [
              this.user.getPermission() &&
                (this.user
                  .getPermission()
                  .some((x) => x === "view_product"))
                ?
                {
                  title: lang == "ar" ? 'ادارة المنتجات' : 'Products Management',
                  icon: 'la-tag',
                  page: '/products/list',
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_user"))
                ?
                {
                  title: lang == "ar" ? 'ادارة العملاء' : 'Customers Management',
                  icon: 'la-users',
                  page: '/users/list',

                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_notification"))
                ?
                {
                  title: lang == "ar" ? 'ادارة الإشعارات' : 'Notification Management',
                  icon: 'la-bell-o',
                  page: '/notification/allNotification',
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_brand"))
                ?
                {
                  title: lang == "ar" ? 'الماركات' : 'Brands',
                  icon: 'la-certificate',
                  page: '/brands/list'

                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_outOfStock"))
                ?
                {
                  title: lang == "ar" ? 'حالة نفاذ الكمية' : 'Out Of Stock',
                  icon: 'la-list-alt',
                  page: '/outOfStock/list'
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_deliveryOption"))
                ?
                {
                  title: lang == "ar" ? 'خيارات التوصيل المتاحة' : 'Delivery Options',
                  icon: 'la-list-alt',
                  page: '/deliveryOptions/list'
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_attribute"))
                ?
                {
                  title: lang == "ar" ? 'خصائص المنتج' : 'Product Attributes',
                  icon: 'la-list-alt',
                  page: '/attributes/list'
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_association"))
                ?
                {
                  title: lang == "ar" ? 'ارتباطات المنتج' : 'Product Associations',
                  icon: 'la-chain',
                  page: '/association/list'
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_payment"))
                ?
                {
                  title: lang == "ar" ? 'خيارات الدفع' : 'Payment Options',
                  icon: 'la-list-alt',
                  page: '/payment/list'
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_review"))
                ?
                {
                  title: lang == "ar" ? 'تقييمات المنتجات' : 'Products Reviews',
                  icon: 'la-list-alt',
                  page: '/reviews/list'
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_order"))
                ?
                {
                  title: lang == "ar" ? 'طلبات الشراء' : 'Purchase Orders',
                  icon: 'la-cart-arrow-down',
                  page: '/orders/list',

                } : {},

              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_coupon"))
                ?
                {
                  title: lang == "ar" ? 'أكواد الحسم' : 'Discount Codes',
                  icon: 'la-money',
                  page: '/discount/history'

                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_delivery"))
                ?
                {
                  title: lang == "ar" ? 'ادارة الموصلين' : 'Delivery Management',
                  icon: 'la-bicycle',
                  page: '/delivery/list',

                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_category"))
                ?
                {
                  title: lang == "ar" ? 'تصنيفات المنتجات' : 'Product Categories',
                  icon: 'la-table',
                  page: '/categories/list'
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_country"))
                ?
                {
                  title: lang == "ar" ? 'ادارة الدول' : 'Countries Manangement',
                  icon: 'la-flag',
                  page: '/countries/list'
                } : {},

              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_faq"))
                ?
                {
                  title: lang == "ar" ? 'ادارة الأسئلة الشائعة' : 'FAQ Management',
                  icon: 'la-question',
                  page: '/FAQs/list',

                } : {},

              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_seller"))
                ?
                {
                  title: lang == "ar" ? 'ادارة البائعين' : 'Sellers Management',
                  icon: 'la la-users',
                  page: '/sellers/list'

                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_warehouse"))
                ?
                {
                  title: lang == "ar" ? 'ادارة المخازن' : 'Warehouse Management',
                  icon: 'la la-industry',
                  page: '/warehouse/list'

                } : {},

              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_about") ||
                this.user.getPermission()
                  .some((x) => x === "update_about")
              )
                ?
                {
                  title: lang == "ar" ? 'الإعدادات' : 'Setting',
                  icon: 'la-gear',
                  page: '/setting/info',
                } : {}
              ,

              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_about"))
                ?
                {
                  title: lang == "ar" ? 'تواصل معنا' : 'Contact Us',
                  icon: 'la-phone',
                  page: '/setting/contactUs',
                } : {},
              this.user.getPermission() && (
                this.user.getPermission()
                  .some((x) => x === "view_about") ||
                this.user.getPermission()
                  .some((x) => x === "update_about")
              )
                ?
                {
                  title: lang == "ar" ? 'اعدادات المنصة' : 'Platform Settings',
                  icon: 'la-gear',
                  page: '/setting/platfrom',

                } : {},
            ]
          }
        };
    // Initialize the service
    this._init();
  }

  private _init(): void {
    // Set the config from the default config
    this._configSubject = new BehaviorSubject(_.cloneDeep(this._defaultConfig));

    // Reload the default layout config on every RoutesRecognized event
    // if the current layout config is different from the default one
    this._router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .subscribe(() => {
        if (!_.isEqual(this._configSubject.getValue().layout, this._defaultConfig.layout)) {
          // Clone the current config
          const config = _.cloneDeep(this._configSubject.getValue());

          // Set the config
          this._configSubject.next(config);
        }
      });
  }

  set config(value) {
    // Get the value from the behavior subject
    let config = this._configSubject.getValue();

    // Merge the new config
    config = _.merge({}, config, value);

    // Notify the observers
    this._configSubject.next(config);
  }

  get config(): any | Observable<any> {
    return this._configSubject.asObservable();
  }

}
