import { Image } from "./Image";

export class SubCategory {
    id: number;
    name_en: string;
    name_ar: string;
    description_en?: any;
    description_ar?: any;
    image: Image;
    activated: boolean;
    accepted: boolean;
    deleted: number;
    product_category_id: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    sub_categories: SubCategory[];
}