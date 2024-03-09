import { Image } from "./Image";

export class About {
    id: number;
    text_ar: string;
    text_en: string;
    phone: string;
    address: string;
    email: string;
    image: Image;
    facebook: string;
    instagram: string;
    twitter: string;
    apple: string;
    google: string;
    website_link: string;
    created_at: Date;
    updated_at: Date;
    privacy_policy_ar : string;
    privacy_policy_en : string; 
    terms_and_conditions_ar : string;
    terms_and_conditions_en : string;
}