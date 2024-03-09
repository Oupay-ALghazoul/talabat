import { City } from './city'

export class Country {
    id: number;
    continent_id: number;
    name: string;
    full_name: string;
    capital: string;
    code: string;
    code_alpha3: string;
    emoji: string;
    has_division: boolean;
    currency_code: string;
    currency_name: string;
    tld: string;
    callingcode: string;
    timezone: string;
    active: boolean;
    local_name: string;
    local_full_name: string;
    local_alias: string;
    local_abbr: string;
    local_currency_name: string;
    cities: City[];
}