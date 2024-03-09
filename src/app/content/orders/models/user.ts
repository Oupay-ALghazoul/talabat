import { Deserializer } from "v8";

import { Deserializable } from './deserializable.model'

export class User implements Deserializable {
    id: number;
    full_name: string;
    email: string;
    email_verified_at?: any;
    phone: string;
    town?: any;
    photo: string;
    firebase_token: string;
    activated: boolean;
    verified: boolean;
    is_logged_in: boolean;
    access_failed_count: string;
    orders_count: string;
    last_login_date: Date;
    timezone: string;
    role: string;
    locale: string;
    deleted: string;
    deleted_at?: any;
    created_at: string;
    updated_at: Date;
    city_id: string;
    country_id: string;
    restaurant_id?: any;
    super_admin: boolean;
    admin: boolean;
    restaurant_manager: boolean;
    member: boolean;
    delivery: boolean;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}
