import { Offer } from './Offer' ;
import { Property } from './Property'
import { Photo } from './Photo'

export class ProductOffer {
    id: number;
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    product_number: string;
    old_price: string;
    new_price: string;
    is_offer: boolean;
    activated: boolean;
    accepted: boolean;
    quantity: number;
    properties: Property[];
    colors: string[];
    photo: Photo;
    images?: any;
    store_id?: any;
    category_id: number;
    sub_category_id: number;
    brand_id: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    offer: Offer;
}