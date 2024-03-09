import { Deserializer } from "v8";
import { Deserializable } from './deserializable.model'

export class Shift  implements Deserializable{
    id: number;
    day_en: string;
    day_ar: string;
    day: string;
    open: string;
    close: string;
    restaurant_id: string;
    created_at?: any;
    updated_at?: any;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}