import { Deserializer } from "v8";

import { Deserializable } from './deserializable.model'

export class Country  implements Deserializable{
    id: number;
    name_en: string;
    name_ar: string;
    abbreviation: string;
    international_code: string;
    currency_ar: string;
    currency_en: string;
    currency_vs_dollar: string;
    deleted: string;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}