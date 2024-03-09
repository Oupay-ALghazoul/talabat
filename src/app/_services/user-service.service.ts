import { Injectable, Inject } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(@Inject('LOCALSTORAGE') private localStorage: any) { }
  getUser(): User {
    const user: User = JSON.parse(this.localStorage.getItem('adminTalabat'));
    return user;
  }
  getPermission(): String[] {

    const permissionList: String[] =
      JSON.parse(this.localStorage.getItem('permission-talabate'));
    return permissionList;


  }
}
