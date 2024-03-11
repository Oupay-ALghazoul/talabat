import { HttpClient } from  '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { User } from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { User } from './models/User';
import { Observable } from 'rxjs';
import { Slide } from './models/Slide';

@Injectable({
    providedIn: 'root'
  })

export class Constant {

baseUrl : string ="https://api.talabatexpress.com/api/"
adminUrl : string ="https://api.talabatexpress.com/admin/"

// baseUrl : string ="https://beta123.talabatexpress.com/api/"
// adminUrl : string ="https://beta123.talabatexpress.com/admin/"

// baseUrl : string = "/api/";
// adminUrl : string = "/admin/" ;

public firstParmas : string = '?'
public secondParams : string = '&' ;
public
 lang = localStorage.getItem("selected") != null? localStorage.getItem("selected").split('"').join('')  : 'ar';
public locale : string = "locale=" + this.lang

public login : string = this.baseUrl +  "login" + this.firstParmas + this.locale;
public logoutApi : string = this.baseUrl +  "logout"
// un used yet
public updateLangApi : string = this.baseUrl + "updateLocale"
public systemParamApi : string = this.baseUrl + "systemParam"

public getAllCategoriesApi : string = this.adminUrl + "productCategory"
public addCategoryApi : string = this.adminUrl + "productCategory"
public getCategoryByIdApi : string = this.adminUrl + "productCategory/"
public updateCategoryApi : string = this.adminUrl +"productCategory/"
public deleteCategoryApi : string = this.adminUrl + "productCategory/"

public getBrandsApi : string = this.adminUrl + "brand"
public addBrandApi : string = this.adminUrl + "brand"
public getBrandByIdApi : string = this.adminUrl + "brand/"
public updateBrandApi : string = this.adminUrl + "brand/"
public deleteBrandApi : string = this.adminUrl + "brand/"
public updateBrandPartialApi  : string = this.adminUrl + "brand/"

public getAllUsersApi : string = this.adminUrl + "user"
public addUserApi : string = this.adminUrl + "user"
public updateUserApi : string = this.adminUrl + "user/"

public getAllCountriesApi : string = this.adminUrl + "country"
public getCountryByIdApi : string = this.adminUrl + "country/"
public addCountryApi : string =  this.adminUrl +  "country"
public updateCountryApi : string = this.adminUrl + "country/"
public deleteCountryApi : string = this.adminUrl + "country/"

public getAllProductsApi : string = this.adminUrl + "product"
public addProductApi : string = this.adminUrl + "product?currency=USD"
public getProductByIdApi : string = this.adminUrl + "product/"
public updateProductApi : string = this.adminUrl + "product/"
public deleteProductApi : string = this.adminUrl + "product/"
public updateProductPartialApi : string = this.adminUrl  + "product/"

public updateProductColorApi : string = this.adminUrl + "productColor/"
public deleteProductColorApi : string = this.adminUrl + "productColor/"
public addProductColorApi : string = this.adminUrl +"productColor"

public updateProductSizeApi : string = this.adminUrl + "productSize/"
public deleteProductSizeApi : string = this.adminUrl + "productSize/"
public addProductSizeApi : string = this.adminUrl + "productSize"

public getAllReviewsApi : string = this.adminUrl +"review"
public addReviewApi : string = this.adminUrl +"review"
public getReviewByIdApi :  string = this.adminUrl +"review/"
public updateReviewApi  :  string = this.adminUrl +"review/"
public deleteReviewApi :  string = this.adminUrl +"review/"

public getAllSellersApi :  string = this.adminUrl +"seller"
public addSellerApi:  string = this.adminUrl +"seller"
public getSellerByIdApi :  string = this.adminUrl +"seller/"
public updateSellerApi :  string = this.adminUrl +"seller/"
public deleteSellerApi :   string = this.adminUrl +"seller/"

// un used yet
public getProductExtraApi : string = this.adminUrl + "productExtra"
public addProductExtraApi : string = this.adminUrl +  "productExtra"
public getProductExtraByIdApi : string = this.adminUrl +  "productExtra/"
public updateProductExtraApi : string = this.adminUrl +  "productExtra/"
public deleteProductExtraApi : string = this.adminUrl +  "productExtra/"

public updateBestCollectionApi : string = this.adminUrl +  "updateBestCollection/"
public updateNewlyAddedApi : string = this.adminUrl + "updateNewlyAdded/"
public updateFlashDealsApi : string = this.adminUrl + "updateFlashDeals/"
public updateSelectedApi : string = this.adminUrl +  "updateSelected/"

// un used yet
public getProductExtraOptionApi : string = this.adminUrl +  "productExtraOption"
public addProductExtraOptionApi : string = this.adminUrl +  "productExtraOption"
public deleteProductExtraOptionApi : string = this.adminUrl +  "productExtraOption/"

public getAboutApi : string = this.adminUrl +"about"
public updateAboutApi : string = this.adminUrl +"about"
public getContactUsApi : string = this.adminUrl +"contact"

public getDeliveryApi : string = this.adminUrl +"delivery"
public addDeliveryApi : string = this.adminUrl +"delivery"
public getDeliveryByIdApi : string = this.adminUrl +"delivery/"
public updateDeliveryApi : string = this.adminUrl + "delivery/"
public deleteDeliveryApi : string = this.adminUrl +"delivery/"

public getManagerApi : string = this.adminUrl + "manager"
public getManagerByIdApi : string = this.adminUrl + "manager/"
public addManagerApi : string = this.adminUrl + "manager" 
public updateManagerAPi : string = this.adminUrl + "manager/"
public deleteManagerApi : string = this.adminUrl + "manager/"

public getAllRolesApi : string = this.adminUrl + "role"  
public addNewRoleApi : string = this.adminUrl + "role" 
public getRoleByIdApi : string = this.adminUrl + "role/"
public updateRoleApi : string = this.adminUrl + "role/"
public deleteRoleApi : string = this.adminUrl + "role/"

public getAllPermissionsApi : string = this.adminUrl + "permission"

public getAllFAQsApi : string = this.adminUrl + "faq"
public getFAQByIdApi : string = this.adminUrl + "faq/"
public addNewFAQApi : string = this.adminUrl + "faq"
public updateFAQApi : string = this.adminUrl + "faq/"
public deleteFAQApi : string = this.adminUrl + "faq/"

public outOfStockApi : string = this.adminUrl +"outOfStock"
public addoutOfStockApi : string = this.adminUrl +"outOfStock"
public getOutOfStockByIdApi  : string = this.adminUrl +"outOfStock/"
public updateOutOfStockApi: string = this.adminUrl +"outOfStock/"
public deleteOutOfStockApi: string = this.adminUrl +"outOfStock/"

public getDeliveryOptionApi : string = this.adminUrl +"deliveryOption"
public addDeliveryOptionApi : string = this.adminUrl +"deliveryOption"
public getDeliveryOptionByIdApi : string = this.adminUrl +"deliveryOption/"
public updateDeliveryOptionApi: string = this.adminUrl +"deliveryOption/"
public deleteDeliveryOptionApi: string = this.adminUrl +"deliveryOption/"

public getAttributeApi : string = this.adminUrl + "attribute"
public addAttributeApi : string = this.adminUrl + "attribute"
public getAttributeByIdApi : string = this.adminUrl + "attribute/"
public updateAttributeApi : string = this.adminUrl + "attribute/"
public deleteAttributeApi : string = this.adminUrl + "attribute/"

public getAssociationApi : string = this.adminUrl + "association"
public addAssociationApi : string = this.adminUrl + "association"
public getAssociationByIdApi : string = this.adminUrl + "association/"
public updateAssociationApi : string = this.adminUrl + "association/"
public deleteAssociationApi : string = this.adminUrl + "association/"

public getPaymentApi : string = this.adminUrl + "payment"
public addPaymentApi : string = this.adminUrl + "payment"
public getPaymentByIdApi : string = this.adminUrl + "payment/"
public updatePaymentApi : string = this.adminUrl + "payment/"
public deletePaymentApi : string = this.adminUrl + "payment/"

public viewUserProfileApi : string = this.adminUrl + "user/"
public profileApi : string = this.baseUrl + "user"
public updateMyProfileApi : string = this.baseUrl + "user"
public deleteUserApi : string = this.adminUrl + "user/"
public resetPasswordApi : string = this.baseUrl + "resetPassword"

// un used yet
public sendDiscountApi : string = this.adminUrl +"coupon"
public getDiscountApi : string = this.adminUrl +"coupon"
public deleteDiscountApi : string = this.adminUrl +"coupon/"
public updateDiscountApi : string = this.adminUrl +"coupon/"

public getNotificationApi : string = this.adminUrl + "notification"
public sendNotificationApi : string = this.adminUrl +"notification"


public getAllOrdersWithFilterApi : string = this.adminUrl +"order"
public getOrderDetailsApi : string = this.adminUrl +"order/"
public cancelOrderApi : string = this.adminUrl + "cancelOrder/"
public payOrderApi : string = this.adminUrl + "payOrder/"
public approveOrderApi : string = this.adminUrl +  "approveOrder/"
public deliveredOrderApi : string = this.adminUrl +  "markAsDelivered/"
public ongoingOrderApi : string = this.adminUrl +  "markAsOngoing/"
public refundOrderApi : string = this.adminUrl +  "refundOrder/"

// un used yet
public updateOrderAcceptanceApi : string = this.adminUrl +"updateOrderAcceptance/"
public orderPreparedApi : string = this.adminUrl +"orderPrepared/"
public orderOnGoingApi : string = this.adminUrl + "orderOnGoing/"
public assignOrderToDeliveryApi : string = this.adminUrl + "assignOrderToDelivery"
public orderCheckoutApi : string = this.adminUrl +"cashCheckedOut/"
public deleteOrderApi : string = this.adminUrl + "order/"

public getPlatformSettingsApi : string = this.adminUrl +"platformSettings"
public updatePlatformSettingsApi  : string = this.adminUrl +"platformSettings"

public salesChartApi : string = this.adminUrl + "salesChart?year="
public salesNewCustomersApi : string = this.adminUrl +  "salesNewCustomers"
public salesSummaryApi : string = this.adminUrl +  "salesSummary?year="
public salesNewOrdersApi : string = this.adminUrl + "salesNewOrders"

// warehouse
public getWarehouseApi : string = this.adminUrl + "warehouse"
public addWarehouseApi : string = this.adminUrl + "warehouse"
public getWarehouseByIdApi : string = this.adminUrl + "warehouse/"
public updateWarehouseApi : string = this.adminUrl + "warehouse/"
public deleteWarehouseApi : string = this.adminUrl + "warehouse/"

public insertTokenApi : string = this.baseUrl +"updateFCMToken"

// exports
public exportCountriesApi : string = this.adminUrl + "exportCountries"
public exportCategoriesApi : string = this.adminUrl + "exportCategories"
public exportDiscountsApi : string = this.adminUrl +"exportDiscounts"
public exportFAQsApi : string = this.adminUrl +"exportFAQs"
public exportOffersApi : string = this.adminUrl +"exportOffers"
public exportDeliveriesApi : string = this.adminUrl +"exportDeliveries"
public exportUsersApi : string = this.adminUrl +"exportUsers"
public exportNotificationsApi : string = this.adminUrl +"exportNotifications"
public exportOrdersApi : string = this.adminUrl +"exportOrders"

public mainSlidersApi : string = this.adminUrl +"mainSliders"
public secSlidersApi : string = this.adminUrl +"secSliders"
public sliderApi : string = this.adminUrl +"slider"


constructor(public http: HttpClient ,  private router: Router ,
    private route: ActivatedRoute , private toastr: ToastrService) {

}

// update lang parameter
public updateLang()
{  
  this.lang = localStorage.getItem("selected") != null? 
  localStorage.getItem("selected").split('"').join('')  : 'ar';
  this.profile().then((res: User) => {
    console.log(res)
    const newItem: { [k: string]: any } = {}
    newItem.first_name = res.first_name;
    newItem.last_name = res.last_name;
    newItem.email = res.email;
    newItem.phone = res.phone;
    newItem.city_id = res.city_id;
    newItem.activated = res.activated;

    newItem.gender = res.gender;
    newItem.birth_date = res.birth_date == null ? '' : res.birth_date.substring(0, 10);
    newItem.locale = this.lang ;
    newItem.firebase_token = res.firebase_token;
    newItem.image_quality = "High Quality"
    newItem.orders = 1;
    newItem.emails = 1;
    newItem.promotions = 1 ;
    newItem.others = 1 ;

    console.log(newItem)

    this.updateMyProfile(newItem).then(
      res => {
       console.log(res)
       window.location.reload();
      }, err => {
        console.log(res)
      })
    
  },(err=>{
    console.log(err)
  }))
}
public loginMethod(value) {
    let data = {
      "password" : value.password,
      "phone" : value.phone ,
      "email" : ""
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.login, data ).toPromise().then(
      (res) => {
        resolve(res);
      }, err => {
        console.log(err)
        reject(err.error.error);
      }
      );
    });
    
}

navigateToLogin(error){
  console.log(error)
  if(error.session === "expired"){
    localStorage.clear();
    sessionStorage.clear();
    if(this.lang  == 'ar'){
      this.toastr.error( "انتهت الجلسة سجل الدخول مرة أخرى");
    }else{
      this.toastr.error( "Session End Please Login Again");
    }
    this.router.navigateByUrl('/');
  }
}

getPosition(): Promise<any> {
  return new Promise((resolve, reject) => {

    navigator.geolocation.watchPosition(resp => {
      console.log(resp);
      localStorage.setItem('coords', JSON.stringify(Object.assign({}, { lng: resp.coords.longitude, lat: resp.coords.latitude })));

      resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
    },
      err => {

        reject(err);
      });
  });
}
public  saveUser(user : User) : boolean
{ 
    
    try {
    
    localStorage.setItem("adminTalabat", JSON.stringify(user));
}
    catch (e) {
        return false;
    }
    return true;
}
public  getUserObject(): User {
     return JSON.parse(localStorage.getItem("adminTalabat")) as User;
}
public  clearUserObject(): boolean{
    try {            
        localStorage.removeItem("adminTalabat");
    }
    catch (e) {
        return false;
    }
    return true;
}
// getAllCategoriesApi
public getAllCategories(paginated , page ,  status , word , activated )
{
  console.log(this.getAllCategoriesApi +'?paginated=' + paginated  + "&page=" + page +
  "&status=" + status + "&word_filter=" + word +"&activated=" + activated +
   this.secondParams + this.locale + "&per_page=10")
  return new Promise((resolve, reject) => {

      this.http.get(this.getAllCategoriesApi +'?paginated=' + paginated  + "&page=" + page +
       "&status=" + status + "&word_filter=" + word +"&activated=" + activated +
        this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// getValidCategories
public getValidCategories()
{
  console.log(this.getAllCategoriesApi +'?paginated=false&only_valid=true&activated=1' +
  this.secondParams + this.locale)
  return new Promise((resolve, reject) => {

      this.http.get(this.getAllCategoriesApi +'?paginated=false&only_valid=true&activated=1' +
        this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// getActiveCategories
public getActiveCategories()
{
  return new Promise((resolve, reject) => {

      this.http.get(this.getAllCategoriesApi +'?paginated=false&activated=1' +
        this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// getValidCategories
public getCategories( activated , word , special , you_may_like )
{
  // this.activated , this.word , this.special , this.you_may_like 
  console.log(this.getAllCategoriesApi +'?paginated=false&activated=' + activated +
  "&word_filter=" + word + "&special=" + special + "&you_may_like=" + you_may_like + 
  this.secondParams + this.locale)
  return new Promise((resolve, reject) => {

      this.http.get(this.getAllCategoriesApi +'?paginated=false&activated=' + activated +
        "&word_filter=" + word + "&special=" + special + "&you_may_like=" + you_may_like + 
        this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// getValidCategories
public getActiveAllCategories()
{
  console.log(this.getAllCategoriesApi +'?paginated=false&activated=1&flatten' +
  this.secondParams + this.locale)
  return new Promise((resolve, reject) => {

      this.http.get(this.getAllCategoriesApi +'?paginated=false&activated=1&flatten=true' +
        this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// addCategory
public addCategory(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addCategoryApi + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });

}
// getCategoryByIdApi
public getCategoryById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getCategoryByIdApi + id + this.secondParams + this.locale).toPromise().then(
    (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// updateCategoryApi
public updateCategory(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateCategoryApi + id + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// deleteCategory
public deleteCategory( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteCategoryApi + id + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);  
    }
    );
  });
}

// getBrandsApi
public getBrands(paginated , page , word , activated ,  special  )
{
  console.log(this.getBrandsApi +'?paginated=' + paginated  + "&page=" + page +
  "&word_filter=" + word +"&activated=" + activated + "&special=" + special +
   this.secondParams + this.locale + "&per_page=10")
   
  return new Promise((resolve, reject) => {

      this.http.get(this.getBrandsApi +'?paginated=' + paginated  + "&page=" + page +
       "&word_filter=" + word +"&activated=" + activated + "&special=" + special +
        this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// getActiveBrand
public getActiveBrand()
{
  console.log(this.getBrandsApi +'?paginated=false&activated=1' +
  this.secondParams + this.locale)
  return new Promise((resolve, reject) => {

      this.http.get(this.getBrandsApi +'?paginated=false&activated=1' +
        this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// addBrand
public addBrand(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addBrandApi + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });

}
// getBrandById
public getBrandById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getBrandByIdApi + id + this.secondParams + this.locale).toPromise().then(
    (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// updateBrandPartial
public updateBrandPartial(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.patch(this.updateBrandPartialApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateBrand
public updateBrand(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateBrandApi + id + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// deleteBrandApi
public deleteBrand( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteBrandApi + id + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);  
    }
    );
  });
}
public getAllUsers(paginated , page  , word , activated , role , phone )
{
console.log(this.getAllUsersApi +'?paginated=' + paginated  + "&page=" + page +
"&role_filter=" + role + "&word_filter=" + word +"&activated=" + activated +"&phone_filter=" + phone +
 this.secondParams + this.locale + "&per_page=10")
  return new Promise((resolve, reject) => {

      this.http.get(this.getAllUsersApi +'?paginated=' + paginated  + "&page=" + page +
       "&role_filter=" + role + "&word_filter=" + word +"&activated=" + activated +"&phone_filter=" + phone +
        this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
public getAllUsersMenu(){
  return new Promise((resolve, reject) => {

    this.http.get(this.getAllUsersApi +'?paginated=false' +
      this.secondParams + this.locale).toPromise().then(
    (res) => {
    resolve(res);
  }, err => {
    reject(err.error.error);
    this.navigateToLogin(err.error);
  }
  );
});
}
// addUser
public addUser(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addUserApi , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// updateUser
public updateUser(id , content )
{
  return new Promise((resolve, reject) => {
    this.http.put(this.updateUserApi + id +  this.firstParmas + this.locale  , content).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

getMainSlider(params = {}): Observable<Slide[]> {
  return this.http.get<Slide[]>(this.mainSlidersApi, {
    params: {...params, "locale" : this.lang}
  })
}

getSecSlider(params = {}): Observable<Slide[]> {
  return this.http.get<Slide[]>(this.secSlidersApi, {
    params: {...params, "locale" : this.lang}
  })
}

showSlide(id: number, params = {}): Observable<Slide> {
  return this.http.get<Slide>(`${this.sliderApi}/${id}`, {
    params: {...params, "locale" : this.lang}
  })
}

addSlide(data: any, params = {}): Observable<any> {
  return this.http.post<any>(this.sliderApi, data, {
    params: {...params, "locale" : this.lang}
  })
}

updateSlide(id: number, data: any, params = {}): Observable<any> {
  return this.http.post<any>(`${this.sliderApi}/${id}`, data, {
    params: {...params, "locale" : this.lang}
  })
}

deleteSlide(id: number): Observable<any> {
  return this.http.delete<any>(`${this.sliderApi}/${id}`)
}

// Get All Countries
public getAllCountries(paginated , page , word , state)
{
  console.log(this.getAllCountriesApi +'?paginated=' + paginated  + "&page=" + page +
  "&word_filter=" + word + "&activated=" + state +  this.secondParams + this.locale + "&per_page=10")
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllCountriesApi +'?paginated=' + paginated  + "&page=" + page +
     "&word_filter=" + word + "&activated=" + state +  this.secondParams + this.locale + "&per_page=10").toPromise().then(
    (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
//getAllCountriesMenu
public getAllCountriesMenu()
{
  console.log(this.getAllCountriesApi +'?paginated=false&activated=true' )
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllCountriesApi +'?paginated=false&activated=true' + this.secondParams + this.locale).toPromise().then(
    (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// addNewCountryApi
public addCountry(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addCountryApi +  this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });

}
// getCountryByIdApi
public getCountryById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getCountryByIdApi + id + this.secondParams + this.locale).toPromise().then(
    (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
//  updateCountryApi
public updateCountry(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateCountryApi + id + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
// deleteCountryApi
public deleteCountry( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteCountryApi + id +  this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
  
}
// getAllProductsApi
// this.flash_deal , this.best_collection ,   this.newly_added 
public getAllProducts( paginated , page , catId , brandId , code , state ,  word , 
  flash_deal , best_collection , newly_added  , selected)
{
  console.log(this.getAllProductsApi + "?paginated=" + paginated + "&page=" + page 
  + "&categories_filter=" + catId   + "&brand_filter=" + brandId
  + "&code_filter=" + code + "&activated=" + state
  + "&word_filter=" + word + "&flash_deal=" + flash_deal + "&best_collection=" + best_collection 
  + "&newly_added=" + newly_added +  "&selected=" + selected + 
  this.secondParams + this.locale + "&per_page=10")
 
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllProductsApi + "?paginated=" + paginated + "&page=" + page 
    + "&categories_filter=" + catId   + "&brand_filter=" + brandId
    + "&code_filter=" + code + "&activated=" + state
    + "&word_filter=" + word + "&flash_deal=" + flash_deal + "&best_collection=" + best_collection 
    + "&newly_added=" + newly_added +  "&selected=" + selected + 
    this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAllProducts menu
public getAllProductsMenu( )
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllProductsApi + "?paginated=false" + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addProductApi
public addProduct(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addProductApi + this.secondParams + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getProductById
public getProductById(id)
{
  return new Promise((resolve, reject) => {

    this.http.get(this.getProductByIdApi + id + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateProductApi
public updateProduct(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateProductApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateParmas
public updateProductPartial(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.patch(this.updateProductPartialApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateBestCollection
public updateBestCollection(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.patch(this.updateBestCollectionApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateNewlyAddedApi
public updateNewlyAdded(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.patch(this.updateNewlyAddedApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateFlashDeals
public updateFlashDeals(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.patch(this.updateFlashDealsApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateSelectedApi
public updateSelected(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.patch(this.updateSelectedApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteProductApi
public deleteProduct( id ){  
console.log(this.deleteProductApi + id)
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteProductApi + id +  this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
  
}
// getProductExtra
public getProductExtra(id , paginated , page , word)
{
  return new Promise((resolve, reject) => {

    this.http.get(this.getProductExtraApi  + "?product_id=" + id  + "&paginated=" + paginated + "&page=" + page 
    + "&word_filter=" + word +  this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addProductExtraApi
public addProductExtra(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addProductExtraApi + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getProductExtraByIdApi
public getProductExtraById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getProductExtraByIdApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateProductExtraApi
public updateProductExtra(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateProductExtraApi + id + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteProductExtraApi
public deleteProductExtra( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteProductExtraApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//productExtraOption
public getProductExtraOption(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getProductExtraOptionApi + "?extra_id=" + id  + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addProductExtraOptionApi
public addProductExtraOption(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addProductExtraOptionApi + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteProductExtraOptionApi
public deleteProductExtraOption( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteProductExtraOptionApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAboutApi
public getAbout()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAboutApi + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateAboutApi
public updateAbout( content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateAboutApi + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// get all delivery
public getAllDelivery(paginated , page  , word , activated , phone )
{
  console.log(this.getDeliveryApi +'?paginated=' + paginated  + "&page=" + page +
  "&word_filter=" + word +"&activated=" + activated +"&phone_filter=" + phone +
   this.secondParams + this.locale + "&per_page=10")

  return new Promise((resolve, reject) => {

      this.http.get(this.getDeliveryApi +'?paginated=' + paginated  + "&page=" + page +
       "&word_filter=" + word +"&activated=" + activated +"&phone_filter=" + phone +
        this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}

// addDeliveryApi
public addDelivery(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addDeliveryApi   + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getDeliveryByIdApi
public getDeliveryById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getDeliveryByIdApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateDeliveryApi
public updateDelivery(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateDeliveryApi + id  + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteDeliveryApi
public deleteDelivery( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteDeliveryApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//getManagerApi
public getManager(paginated , page  , word , activated  , phone )
{
  console.log(this.getManagerApi +'?paginated=' + paginated  + "&page=" + page +
  "&word_filter=" + word +"&activated=" + activated +"&phone_filter=" + phone +
   this.secondParams + this.locale + "&per_page=10"
  )
  return new Promise((resolve, reject) => {

      this.http.get(this.getManagerApi +'?paginated=' + paginated  + "&page=" + page +
       "&word_filter=" + word +"&activated=" + activated +"&phone_filter=" + phone +
        this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
//getMnagerById
public getManagerById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getManagerByIdApi + id  + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addManagerApi
public addManager(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addManagerApi + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
public updateManager(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateManagerAPi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteManager
public deleteManager( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteManagerApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
  
}
// getAllRolesApi
public getAllRoles( paginated , page )
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllRolesApi +'?paginated=' + paginated  + "&page=" + page
    +  this.secondParams + this.locale + "&per_page=10" ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//getAllRolesMenu
public getAllRolesMenu()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllRolesApi +'?paginated=false' 
    +  this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//getRoleByIdApi
public getRoleById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getRoleByIdApi + id + this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//addNewRoleApi
public addNewRole(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addNewRoleApi + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
public updateRole(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateRoleApi + id + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//deleteRoleApi
public deleteRole( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteRoleApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
  
}
// getAllPermissionsApi
public getAllPermissions()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllPermissionsApi  + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAllFAQsApi
public getAllFAQs(paginated , page ,  word)
{ 
    console.log( this.getAllFAQsApi +'?paginated=' + paginated  + "&page=" + page +
       "&word_filter=" + word + this.secondParams + this.locale + "&per_page=10" )
  return new Promise((resolve, reject) => {
    this.http.get( this.getAllFAQsApi +'?paginated=' + paginated  + "&page=" + page +
       "&word_filter=" + word + this.secondParams + this.locale + "&per_page=10").toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//getFAQByIdApi
public getFAQById(id)
{
  // return ;
  return new Promise((resolve, reject) => {
    this.http.get(this.getFAQByIdApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addNewFAQApi
public addNewFAQ(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addNewFAQApi + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateFAQApi
public updateFAQ(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateFAQApi + id + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteFAQApi
public deleteFAQ( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteFAQApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getNotificationApi
public getNotification(paginated , page , word , role)
{ 
  console.log(this.getNotificationApi + '?paginated=' + paginated +  "&page=" + page + "&word_filter=" + word + "&role=" 
  + role + "&per_page=10" + this.secondParams + this.locale )
  return new Promise((resolve, reject) => {
    this.http.get(this.getNotificationApi + '?paginated=' + paginated +  "&page=" + page + "&word_filter=" + word + "&role=" 
    + role + "&per_page=10" + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// sendNotificationApi
public sendNotification(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.sendNotificationApi + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getContactUsApi
public getContactUs(paginated , page , word )
{ 
  return new Promise((resolve, reject) => {
    this.http.get(this.getContactUsApi + '?paginated=' + paginated +  "&page=" + page + "&word_filter=" + word 
    +  "&per_page=10" + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// outOfStockApi
public outOfStock()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.outOfStockApi  + this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addoutOfStock
public addoutOfStock(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addoutOfStockApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getOutOfStockByIdApi
public getOutOfStockById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getOutOfStockByIdApi  + id +  this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateOutOfStock
public updateOutOfStock( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateOutOfStockApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteOutOfStockApi
public deleteOutOfStock( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteOutOfStockApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getDeliveryOptionApi
public getDeliveryOption()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getDeliveryOptionApi  + this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addDeliveryOption
public addDeliveryOption(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addDeliveryOptionApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getDeliveryOptionByIdApi
public getDeliveryOptionById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getDeliveryOptionByIdApi  + id +  this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateDeliveryOptionApi
public updateDeliveryOption( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateDeliveryOptionApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteDeliveryOptionApi
public deleteDeliveryOption( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteDeliveryOptionApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// getAttributeApi
public getAttribute()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAttributeApi  + this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addAttributeApi
public addAttribute(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addAttributeApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAttributeByIdApi
public getAttributeById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAttributeByIdApi  + id +  this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateAttributeApi
public updateAttribute( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateAttributeApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteAttributeApi
public deleteAttribute( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteAttributeApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// getAssociationApi
public getAssociation()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAssociationApi  + this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addAssociationApi
public addAssociation(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addAssociationApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAssociationByIdApi
public getAssociationById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAssociationByIdApi  + id +  this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateAssociationApi
public updateAssociation( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateAssociationApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteAssociationApi
public deleteAssociation( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteAssociationApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// getPaymentApi
public getPayment()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getPaymentApi  + this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addPaymentApi
public addPayment(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addPaymentApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getPaymentByIdApi
public getPaymentById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getPaymentByIdApi  + id +  this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updatePaymentApi
public updatePayment( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updatePaymentApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deletePaymentApi
public deletePayment( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deletePaymentApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateProductColorApi
public updateProductColor( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateProductColorApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteProductColorApi
public deleteProductColor( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteProductColorApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//addProductColorApi 
public addProductColor(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addProductColorApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addProductSize
public addProductSize(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addProductSizeApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateProductSize
public updateProductSize( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateProductSizeApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteProductSize
public deleteProductSize( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteProductSizeApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAllReviewsApi
public getAllReviews(state , word )
{
  console.log(this.getAllReviewsApi  + this.firstParmas + this.locale 
    + "&state_filter=" + state + "&word_filter=" + word )
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllReviewsApi  + this.firstParmas + this.locale 
      + "&state_filter=" + state + "&word_filter=" + word ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteReview
public deleteReview( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteReviewApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addReviewApi
public addReview(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addReviewApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getReviewById
public getReviewById( id ){  
  return new Promise((resolve, reject) => {
    this.http.get( this.getReviewByIdApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateReviewApi
public updateReview( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateReviewApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAllSellersApi
public getAllSellers( paginated , page , state , word , phone )
{
  console.log( this.getAllSellersApi  + this.firstParmas + this.locale 
    + "&activated=" + state + "&word_filter=" + word +'&paginated=' + paginated  + "&page=" + page 
    + "&per_page=10" + "&phone_filter=" + phone )
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllSellersApi  + this.firstParmas + this.locale 
      + "&activated=" + state + "&word_filter=" + word +'&paginated=' + paginated  + "&page=" + page 
      + "&per_page=10" + "&phone_filter=" + phone ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getAllSellersApi
public getAllSellersMenu()
{
  console.log(this.getAllSellersApi  + this.firstParmas + this.locale 
    + "&activated=true"  +'&paginated=false')
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllSellersApi  + this.firstParmas + this.locale 
      + "&activated=true"  +'&paginated=false').toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addSeller
public addSeller(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addSellerApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getSellerByIdApi
public getSellerById( id ){  
  return new Promise((resolve, reject) => {
    this.http.get( this.getSellerByIdApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateSeller
public updateSeller( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateSellerApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteSellerApi
public deleteSeller( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteSellerApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getPlatformSettingsApi
public getPlatformSettings()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getPlatformSettingsApi  + this.firstParmas + this.locale 
  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updatePlatformSettings
public updatePlatformSettings(content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updatePlatformSettingsApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getWarehouseApi
public getWarehouse( paginated , page)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getWarehouseApi  + "?paginated=" + paginated + "&page=" + page + "&per_page=10" +
       this.secondParams + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getWarehouseApi
public getWarehouseMenu()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getWarehouseApi  + "?paginated=false" +
       this.secondParams + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// addWarehouseApi
public addWarehouse(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.addWarehouseApi + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getWarehouseByIdApi
public getWarehouseById(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getWarehouseByIdApi  + id +  this.firstParmas + this.locale  ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateWarehouseApi
public updateWarehouse( id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateWarehouseApi + id + this.firstParmas + this.locale  , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteWarehouseApi
public deleteWarehouse( id ){  
  return new Promise((resolve, reject) => {
    this.http.delete( this.deleteWarehouseApi + id  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}




















































































// Get All Countries
public getActiveCountries()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllCountriesApi + this.firstParmas + this.locale + "&only_valid=true").toPromise().then(
    (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}


// getAllUsersFiltersApi
public getAllUsersFilters(page , activated , role , word )
{
console.log(this.getAllUsersApi + page +"&activated=" + activated + "&role_filter=" + role + 
"&word_filter=" + word + "&per_page=10&paginated=true" + this.secondParams + this.locale)
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllUsersApi + page +"&activated=" + activated + "&role_filter=" + role + 
    "&word_filter=" + word + "&per_page=10&paginated=true" + this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getDelivery
public getDelivery()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getDeliveryApi + "?paginated=false" + this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getDeliveryApi
public getDeliveryWithFilter(page , activated , word )
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getDeliveryApi + "?page=" + page +"&activated=" + activated + "&paginated=true" +
    "&word_filter=" + word + "&per_page=10"  + this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// updateDeliveryPasswordApi
public updateDeliveryPassword(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateDeliveryApi + id  + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// profileApi
public profile()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.profileApi +  this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateMyProfileApi
public updateMyProfile(content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateMyProfileApi + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// viewUserProfileApi
public viewUserProfile(id)
{
  console.log(this.viewUserProfileApi + id + this.firstParmas + this.locale)
  return new Promise((resolve, reject) => {
    this.http.get(this.viewUserProfileApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// deleteUserApi
public deleteUser( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteUserApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// sendDiscountApi
public sendDiscount(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.sendDiscountApi + this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateDiscountApi
public updateDiscount(content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateDiscountApi +  this.firstParmas + this.locale, content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getDiscountApi
public getDiscount(paginated , page )
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getDiscountApi + "?paginated=" + paginated +"&page=" + page 
    + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteDiscountApi
public deleteDiscount(id)
{
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteDiscountApi + id + this.firstParmas + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// resetPasswordApi
public resetPassword(content)
{  
  return new Promise((resolve, reject) => {
    this.http.post(this.resetPasswordApi + this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// exportCountriesApi
public exportCountries(word)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.exportCountriesApi + "?word_filter=" + word 
     + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// exportCategoriesApi
public exportCategories(word , status , activated)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.exportCategoriesApi + '?word_filter=' + word 
    + "&status=" + status + "&activated=" + activated + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// exportDiscountsApi
public exportDiscounts()
{
  return new Promise((resolve, reject) => {
    return this.http.get(this.exportDiscountsApi  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// exportDeliveriesApi
public exportDeliveries(activated , word)
{
  return new Promise((resolve, reject) => {
    return  this.http.get(this.exportDeliveriesApi  + "?activated=" + activated  +
    "&word_filter=" + word + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// exportFAQsApi
public exportFAQs(word)
{
  return new Promise((resolve, reject) => {
    return  this.http.get(this.exportFAQsApi + "?word_filter=" + word
    +  this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// exportOffersApi
public exportOffers(resId , home)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.exportOffersApi + "?restaurant_id=" + resId + "&published_on_home=" +  home
        +  this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// exportUsersApi
public exportUsers( activated , role , word )
{
  return new Promise((resolve, reject) => {
    this.http.get(this.exportUsersApi +"?activated=" + activated + "&role_filter=" + role + 
    "&word_filter=" + word +  this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// exportNotificationsApi
public exportNotifications( page , word )
{
  return new Promise((resolve, reject) => {
    this.http.get(this.exportNotificationsApi + "?page=" + page + "&word_filter=" + word
    + "&per_page=10" +  this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// exportOrdersApi
public exportOrders( order_status , checked_out , accepted , prepared , on_going , delivered , delivery_method 
  , word_filter , page , from , to , deliveryId , start , end )
{
  return new Promise((resolve, reject) => {
    this.http.get(this.exportOrdersApi + "?checked_out=" + checked_out  
    + "&order_status="+ order_status + "&delivery_method="+ delivery_method +
    "&word_filter=" + word_filter +  "&page="+ page + "&paginated=true" + "&per_page=10&from=" + from + "&to=" + to + 
    "&delivery_id=" + deliveryId + this.secondParams + this.locale  + "&start_hour=" + start +":00" +
    "&end_hour=" + end + ":00" +  this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}

// getAllOrdersWithFilterApi
public getAllOrdersWithFilter( page , from , to  , start , end , number , user_id , state_filter , payment_state_filter)
{
  console.log(this.getAllOrdersWithFilterApi + "?page="+ page + "&paginated=true" + "&per_page=10&date_from=" 
  + from + "&date_to=" + to  + "&time_from=" + start  +
   "&time_to=" + end + "&number_filter=" + number + "&user_id=" + user_id  +
   "&state_filter=" + state_filter + "&payment_state_filter=" + payment_state_filter + this.secondParams + this.locale )
  return new Promise((resolve, reject) => {
    this.http.get(this.getAllOrdersWithFilterApi + "?page="+ page + "&paginated=true" + "&per_page=10&date_from=" 
    + from + "&date_to=" + to + "&time_from=" + start  +
     "&time_to=" + end + "&number_filter=" + number + "&user_id=" + user_id  +
     "&state_filter=" + state_filter + "&payment_state_filter=" + payment_state_filter + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// getOrderDetailsApi
public getOrderDetails(id)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getOrderDetailsApi + id + "?currency=USD" + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deleteOrderApi
public deleteOrder( id ){  
  return new Promise((resolve, reject) => {

    this.http.delete( this.deleteOrderApi + id + "?currency=USD" + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);  
    }
    );
  });
}
//cancelOrder
public cancelOrder(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.cancelOrderApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// approveOrderApi
public approveOrder(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.approveOrderApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// deliveredOrderApi
public deliveredOrder(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.deliveredOrderApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// ongoingOrderApi
public ongoingOrder(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.ongoingOrderApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// refundOrderApi
public refundOrder(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.refundOrderApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// payOrderApi
public payOrder(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.payOrderApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// updateOrderAcceptanceApi
public updateOrderAcceptance(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.updateOrderAcceptanceApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// orderPreparedApi
public orderPrepared(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.orderPreparedApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// orderOnGoingApi
public orderOnGoing(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.orderOnGoingApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// assignOrderToDeliveryApi
public assignOrderToDelivery(content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.assignOrderToDeliveryApi +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// orderCheckoutApi
public orderCheckout(id , content)
{  
  return new Promise((resolve, reject) => {
    this.http.put(this.orderCheckoutApi + id +  this.firstParmas + this.locale , content ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
public getActiveDelivery()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.getDeliveryApi + "?paginated=false&activated=true"
    + this.secondParams + this.locale).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
//salesChartApi
public salesChart(year)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.salesChartApi + year + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// salesNewCustomersApi
public salesNewCustomers()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.salesNewCustomersApi  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// salesSummaryApi
public salesSummary(year)
{
  return new Promise((resolve, reject) => {
    this.http.get(this.salesSummaryApi + year + this.secondParams + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// salesNewOrdersApi
public salesNewOrders()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.salesNewOrdersApi  + this.firstParmas + this.locale ).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
// logoutApi
public logout()
{
  return new Promise((resolve, reject) => {
    this.http.post(this.logoutApi , '').toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      reject(err.error.error);
      this.navigateToLogin(err.error);
    }
    );
  });
}
public getSystemParam()
{
  return new Promise((resolve, reject) => {
    this.http.get(this.systemParamApi).toPromise().then(
      (res) => {
      resolve(res);
    }, err => {
      console.log(err)
      reject(err.error.error);
      this.navigateToLogin(err.error);   
    }
    );
  });
}
}
