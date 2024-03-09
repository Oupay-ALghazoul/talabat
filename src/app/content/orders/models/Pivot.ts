import { Deserializer } from "v8";
import { Deserializable } from './deserializable.model'

export class Pivot  implements Deserializable {
    restaurant_id: string;
    category_id: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}