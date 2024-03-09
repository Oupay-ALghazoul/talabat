import { Deserializer } from "v8";

import { Deserializable } from './deserializable.model'

import { Pivot } from './Pivot'

export class Category  implements Deserializable{
    id: number;
    name_en: string;
    name_ar: string;
    photo?: any;
    activated: boolean;
    accepted: boolean;
    deleted: string;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    pivot: Pivot;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}