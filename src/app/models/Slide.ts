import { Category } from './Category';
export class Slide {
    id: number;
    description: string;
    image: string;
    sort: number;
    category_id: number;
    deleted_at?: any;
    created_at?: any;
    updated_at?: any;
    category: Category;
}