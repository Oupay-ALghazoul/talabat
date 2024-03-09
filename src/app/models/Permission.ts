import { Deserializable } from "../content/orders/models/deserializable.model";

export class Permission implements Deserializable{
    id: number;
    type: string;
    name_en: string;
    name_ar: string;
    created_at: Date;
    updated_at: Date;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
 
}