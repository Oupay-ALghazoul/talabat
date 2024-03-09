import { Deserializer } from "v8";
import { Deserializable } from './deserializable.model'

import {City} from './City'
import { Offer } from "./Offer";
import { Shift} from './Shift'
import { Category } from './Category'
import { Country } from "./Country";

export class Restaurant  implements Deserializable {
    id: number;
    name_en: string;
    name_ar: string;
    restaurant_phone: string;
    longitude: string;
    latitude: string;
    has_delivery: boolean;
    has_pickup: boolean;
    activated: boolean;
    accepted: boolean;
    shift_based_state: boolean;
    state: boolean;
    logo?: any;
    cover?: any;
    description_en: string;
    description_ar?: any;
    address_en?: any;
    address_ar?: any;
    commercial_registry_information: string;
    timezone: string;
    delivery_price_per_km: string;
    deleted: string;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    city_id: string;
    country_id: string;
    open_now: boolean;
    country: Country;
    city: City;
    sliders: any[];
    offers: Offer[];
    shifts: Shift[];
    categories: Category[];
    tax_number : any ;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}
