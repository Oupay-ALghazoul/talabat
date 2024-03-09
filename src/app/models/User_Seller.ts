import { Image } from './Image' ;
import { City } from './City' ;
import { AppPreference } from './AppPreference' ;
import { Seller} from './Seller' ;

export class User_Seller {
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
    created_at: Date;
    updated_at: Date;
    full_name: string;
    super_admin: boolean;
    admin: boolean;
    is_seller: boolean;
    member: boolean;
    delivery: boolean;
    city: City;
    app_preference: AppPreference;
    seller: Seller;
}