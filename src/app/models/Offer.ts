export class Offer {
    id: number;
    published_on_home: boolean;
    published_at: string;
    expiration: string;
    timezone: string;
    product_id: number;
    store_id?: any;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    valid_now: boolean;
}