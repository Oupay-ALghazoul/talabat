import { Product } from './Product'

export class ProductExtra {
    id: number;
    title: string;
    title_ar: string;
    description: string;
    description_ar: string;
    max: number;
    product_id: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    product: Product;
    options: any[];
}