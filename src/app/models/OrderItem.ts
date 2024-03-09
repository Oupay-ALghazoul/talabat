import { UnitColor } from './UnitColor';
import { UnitDimensions } from './UnitDimensions' ;
import  { UnitImage } from './UnitImage' ;


export class OrderItem {
    id: number;
    date: string;
    unit_name_en: string;
    unit_name_ar: string;
    unit_dimensions: UnitDimensions;
    unit_weight: number;
    unit_price: string;
    unit_discount: string;
    unit_special_offer: string;
    unit_image: UnitImage;
    unit_color: UnitColor;
    unit_size: string;
    subtracted: number;
    brand_name_en: string;
    brand_name_ar: string;
    purchased_with_points: boolean;
    points: number;
    tax: string;
    total: string;
    subtotal: string;
    discount_total: string;
    special_offer_total: string;
    quantity: number;
    notes: string;
    order_id: number;
    product_id: number;
    seller_id?: any;
    deleted_at?: any;
    created_at?: any;
    updated_at?: any;
    product?: any;
}