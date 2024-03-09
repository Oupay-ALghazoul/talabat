import { Deserializer } from "v8";

import { Deserializable } from './deserializable.model'

export class Meal  implements Deserializable{
    id: number;
    name_en: string;
    name_ar: string;
    meal_details_en: string;
    meal_details_ar: string;
    photo?: any;
    preparation_time: string;
    old_price: string;
    new_price: string;
    activated: boolean;
    accepted: boolean;
    deleted_at?: any;
    created_at?: any;
    updated_at?: any;
    restaurant_id: string;
    category_id: string;
    sub_category_id: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}