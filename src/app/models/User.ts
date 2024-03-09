import { Deserializable } from "../content/orders/models/deserializable.model";
import { City } from "./city";
import { Image } from "./Image";
import { Role } from './Role';
import { AppPreference  } from './AppPreference'

export class User implements Deserializable {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  timezone: string;
  locale: string;
  gender?: any;
  birth_date?: any;
  image: Image;
  firebase_token?: any;
  activated: boolean;
  accepted: boolean;
  verified: boolean;
  role: string;
  city_id: number;
  deleted: number;
  deleted_at?: any;
  created_at: string;
  updated_at: Date;
  full_name: string;
  super_admin: boolean;
  admin: boolean;
  seller: boolean;
  member: boolean;
  delivery: boolean;
  city: City;
  app_preference: AppPreference;
  roles: any[];
  coupons: any[];
    deserialize(input: any) {
      Object.assign(this, input);
      this.roles = input.roles.map(car => new Role().deserialize(car));
      return this;
  }
}
