import { SubCategory } from "./SubCategory";
import { Image } from './Image'

export class Category {
    id: number;
    name_en: string;
    name_ar: string;
    description_en?: any;
    description_ar?: any;
    image: Image;
    activated: boolean;
    accepted: boolean;
    deleted: number;
    product_category_id?: any;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    sub_categories: SubCategory[];
    parent?: any;
    you_may_like : boolean ;
    special : boolean
}