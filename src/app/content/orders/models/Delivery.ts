import { Image } from './Image'

export class Delivery {
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
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    full_name: string;
    super_admin: boolean;
    admin: boolean;
    is_seller: boolean;
    member: boolean;
    delivery: boolean;
}