import { Deserializer } from "v8";

import { Deserializable } from './deserializable.model'

export class Offer implements Deserializable{
    id: number;
    title: string;
    title_ar: string;
    photo: string;
    description: string;
    description_ar: string;
    link: string;
    published_on_home: boolean;
    accepted?: any;
    activated?: any;
    published_at?: any;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    restaurant_id: string;
    meal_id: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}