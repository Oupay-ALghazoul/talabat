import { Dimensions } from './Dimensions'
import { SpecialOffer } from './SpecialOffer'
import { Discount } from './Discount'
import { Image } from './Image'
import { Brand } from './Brand'
import { Category } from './Category'
import { Attribute  } from './Attribute'
import { OutOfStock } from './OutOfStock'
import { Color } from './Color'
import { Size } from './Size'
import { AvailableDeliveryOption } from './AvailableDeliveryOption'
import { Deserializable } from '../content/orders/models/deserializable.model'

export class Product implements Deserializable {
    id: number;
    name_en: string;
    name_ar: string;
    short_description_en: string;
    short_description_ar: string;
    description_en: string;
    description_ar: string;
    meta_tag_title_en: string;
    meta_tag_title_ar: string;
    meta_tag_keywords_en: string[];
    meta_tag_keywords_ar: string[];
    tags: string[];
    seo: string[];
    code: string;
    barcode: string;
    sku: string;
    location: string;
    latitude: string;
    longitude: string;
    price: number;
    quantity: number;
    min_quantity: number;
    max_quantity?: any;
    subtract_stock: boolean;
    shipping_timing: string;
    requires_shipping: boolean;
    availability_date: string;
    length_class: string;
    dimensions: Dimensions;
    weight_class: string;
    weight: number;
    discount: Discount;
    special_offer: SpecialOffer;
    activated: boolean;
    accepted?: any;
    sort: number;
    video?: any;
    image: Image;
    images: any[];
    required_points: number;
    timezone: string;
    brand_id: number;
    out_of_stock_id: number;
    deleted: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    formatted_price: string;
    active_discount: boolean;
    active_special_offer: boolean;
    brand: Brand;
    categories: Category[];
    attributes: Attribute[];
    associations: any[];
    out_of_stock: OutOfStock;
    available_delivery_options: AvailableDeliveryOption[];
    colors: Color[];
    sizes: Size[];
    available_payments : any [] ;
    seller_id : number ;
    best_collection : number ;
    newly_added  : number;
    flash_deal : number ;
    selected  : number ;
    delivery_estimation : string ;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}