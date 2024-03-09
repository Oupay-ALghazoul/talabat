import {Image} from './Image'

export class Brand {
    id: number;
    name_en: string;
    name_ar: string;
    image: Image;
    activated: boolean;
    accepted: boolean;
    deleted: number;
    deleted_at?: any;
    created_at: Date;
    updated_at: Date;
    special : number ;
    sort : number
}