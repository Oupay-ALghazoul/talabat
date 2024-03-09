import { Deserializer } from "v8";

import { Deserializable } from './deserializable.model'

export class BillingAddress   implements Deserializable {
    id: number;
    first_name: string;
    last_name: string;
    company?: any;
    street_address: string;
    province: string;
    city: string;
    postal_code: string;
    phone: string;
    floor: string;
    longitude?: any;
    latitude?: any;
    default: boolean;
    region: string;
    district: string;
    apartment: string;
    boulevard: string;
    house: string;
    country_id: number;
    user_id?: any;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}