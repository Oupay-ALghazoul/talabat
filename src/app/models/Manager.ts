import { Image } from "./Image";
import { City } from "./City" ;
import { Role } from "./Role" ;
import { AppPreference } from './AppPreference'

export class Manager {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    timezone: string;
    locale: string;
    gender?: any;
    birth_date: string;
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
    seller: boolean;
    member: boolean;
    delivery: boolean;
    city: City;
    app_preference: AppPreference;
    roles: Role[];
}