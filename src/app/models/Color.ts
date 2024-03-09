import { Image } from './Image'

export class Color {
    id: number;
    name_en: string;
    name_ar: string;
    hex: string;
    image: Image;
    product_id: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
}