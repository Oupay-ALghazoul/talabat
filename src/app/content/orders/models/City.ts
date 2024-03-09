import { Deserializer } from "v8";

import { Deserializable } from './deserializable.model'

export class City implements Deserializable {
    id: number;
    name_en: string;
    name_ar: string;
    timezone: string;
    deleted: string;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    country_id: string;
      deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}