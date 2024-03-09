export class BillingAddress {
    id: number;
    first_name: string;
    last_name: string;
    company: string;
    street_address: string;
    province: string;
    city: string;
    postal_code: string;
    phone: string;
    longitude?: any;
    latitude?: any;
    default: boolean;
    country_id: number;
    user_id?: any;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
}