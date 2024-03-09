import {Product} from './Product' ;
import { User } from './User'

export class Review {
    id: number;
    date: string;
    title: string;
    comment: string;
    rating: number;
    state: string;
    user_id: number;
    product_id: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    product: Product;
    user: User;
}